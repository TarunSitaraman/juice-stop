import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@juice-stop/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: { include: { menuItem: { select: { id: true, name: true, price: true } } } },
    },
  });
  if (!order) {
    return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
  }
  // Strip phone number from public response
  const { customerPhone: _phone, ...publicOrder } = order;
  return NextResponse.json({ success: true, data: publicOrder });
}
