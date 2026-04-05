import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@juice-stop/db";
import { createOrderSchema } from "@juice-stop/shared";
import { nextTicketId, orderRateLimit } from "@/lib/redis";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "anonymous";
  const { success: allowed } = await orderRateLimit.limit(ip);
  if (!allowed) {
    return NextResponse.json({ success: false, error: "Too many orders. Try again later." }, { status: 429 });
  }

  const body = await req.json();
  const parsed = createOrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Invalid order data", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { customerPhone, deliveryAddress, deliveryNotes, items } = parsed.data;

  const menuItems = await prisma.menuItem.findMany({
    where: { id: { in: items.map((i) => i.menuItemId) }, available: true },
  });
  if (menuItems.length !== items.length) {
    return NextResponse.json({ success: false, error: "One or more items are unavailable" }, { status: 400 });
  }

  const menuMap = new Map(menuItems.map((m) => [m.id, m] as const));
  const totalAmount = items.reduce((sum, item) => {
    return sum + Number(menuMap.get(item.menuItemId)!.price) * item.quantity;
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

  return NextResponse.json({ success: true, data: order }, { status: 201 });
}
