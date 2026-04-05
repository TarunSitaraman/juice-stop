import { Router } from "express";
import multer from "multer";
import { prisma } from "@juice-stop/db";
import { updateOrderStatusSchema } from "@juice-stop/shared";
import { requireAuth } from "../middleware/auth";
import { io } from "../index";

export const restaurantRouter = Router();

// All restaurant routes require auth
restaurantRouter.use(requireAuth);

// GET /api/restaurant/orders?status=PENDING
restaurantRouter.get("/orders", async (req, res) => {
  const { status } = req.query;
  const where = status ? { status: status as string } : {};

  const orders = await prisma.order.findMany({
    where: where as Parameters<typeof prisma.order.findMany>[0]["where"],
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: { menuItem: { select: { id: true, name: true, price: true } } },
      },
    },
  });
  res.json({ success: true, data: orders });
});

// PATCH /api/restaurant/orders/:id/status
restaurantRouter.patch("/orders/:id/status", async (req, res) => {
  const parsed = updateOrderStatusSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, error: "Invalid status value" });
    return;
  }

  const existing = await prisma.order.findUnique({ where: { id: req.params.id } });
  if (!existing) {
    res.status(404).json({ success: false, error: "Order not found" });
    return;
  }

  const order = await prisma.order.update({
    where: { id: req.params.id },
    data: { status: parsed.data.status },
  });

  io.emit("order_updated", {
    orderId: order.id,
    ticketId: order.ticketId,
    status: order.status,
  });

  res.json({ success: true, data: order });
});

// POST /api/restaurant/orders/:id/proof — upload payment proof photo
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only image files are allowed"));
      return;
    }
    cb(null, true);
  },
});

restaurantRouter.post("/orders/:id/proof", upload.single("proof"), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ success: false, error: "No image file uploaded" });
    return;
  }

  // Upload to Vercel Blob via API
  const { put } = await import("@vercel/blob");
  const blob = await put(
    `proofs/${req.params.id}-${Date.now()}.${req.file.mimetype.split("/")[1]}`,
    req.file.buffer,
    { access: "public", contentType: req.file.mimetype }
  );

  const order = await prisma.order.update({
    where: { id: req.params.id },
    data: { proofImageUrl: blob.url },
  });

  res.json({ success: true, data: { proofImageUrl: order.proofImageUrl } });
});
