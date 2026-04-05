import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@juice-stop/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ ticketId: string }> }) {
  const { ticketId } = await params;
  const order = await prisma.order.findUnique({
    where: { ticketId },
    select: { id: true, ticketId: true, status: true, totalAmount: true, createdAt: true, updatedAt: true },
  });
  if (!order) {
    return NextResponse.json({ success: false, error: "Ticket not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: order });
}
