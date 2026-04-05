import { Router } from "express";
import { prisma } from "@juice-stop/db";
import { createOrderSchema } from "@juice-stop/shared";
import { nextTicketId } from "../lib/redis";
import { rateLimit } from "express-rate-limit";
import { io } from "../index";

export const ordersRouter = Router();

// Strict rate limit for order creation — 5 orders per hour per IP
const orderRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { success: false, error: "Too many orders placed. Try again later." },
});

// POST /api/orders
ordersRouter.post("/", orderRateLimit, async (req, res) => {
  const parsed = createOrderSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      error: "Invalid order data",
      details: parsed.error.flatten().fieldErrors,
    });
    return;
  }

  const { customerPhone, deliveryAddress, deliveryNotes, items } = parsed.data;

  // Fetch menu items and validate they exist + are available
  const menuItems = await prisma.menuItem.findMany({
    where: {
      id: { in: items.map((i) => i.menuItemId) },
      available: true,
    },
  });

  if (menuItems.length !== items.length) {
    res.status(400).json({ success: false, error: "One or more items are unavailable or invalid" });
    return;
  }

  // Calculate total
  const menuMap = new Map(menuItems.map((m) => [m.id, m]));
  const totalAmount = items.reduce((sum, item) => {
    const price = parseFloat(menuMap.get(item.menuItemId)!.price.toString());
    return sum + price * item.quantity;
  }, 0);

  const ticketId = await nextTicketId();

  const order = await prisma.order.create({
    data: {
      ticketId,
      customerPhone,
      deliveryAddress,
      deliveryNotes,
      totalAmount: totalAmount.toFixed(2),
      items: {
        create: items.map((item) => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          unitPrice: menuMap.get(item.menuItemId)!.price,
        })),
      },
    },
    include: {
      items: { include: { menuItem: { select: { id: true, name: true, price: true } } } },
    },
  });

  // Emit to restaurant room
  io.to("restaurant").emit("new_order", { order });

  res.status(201).json({ success: true, data: order });
});

// GET /api/orders/:id
ordersRouter.get("/:id", async (req, res) => {
  const order = await prisma.order.findUnique({
    where: { id: req.params.id },
    include: {
      items: { include: { menuItem: { select: { id: true, name: true, price: true } } } },
    },
  });
  if (!order) {
    res.status(404).json({ success: false, error: "Order not found" });
    return;
  }
  // Strip phone from public response
  const { customerPhone: _phone, ...publicOrder } = order;
  res.json({ success: true, data: publicOrder });
});

// GET /api/orders/ticket/:ticketId
ordersRouter.get("/ticket/:ticketId", async (req, res) => {
  const order = await prisma.order.findUnique({
    where: { ticketId: req.params.ticketId },
    select: {
      id: true,
      ticketId: true,
      status: true,
      totalAmount: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!order) {
    res.status(404).json({ success: false, error: "Ticket not found" });
    return;
  }
  res.json({ success: true, data: order });
});
