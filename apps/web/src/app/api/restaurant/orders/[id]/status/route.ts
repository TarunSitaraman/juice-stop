import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@juice-stop/db";
import { requireStaff } from "@/lib/auth-helper";
import { updateOrderStatusSchema } from "@juice-stop/shared";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireStaff(req);
  if ("error" in auth) return auth.error;

  const parsed = updateOrderStatusSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "Invalid status value" }, { status: 400 });
  }

  const { id } = await params;
  const existing = await prisma.order.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
  }

  const order = await prisma.order.update({
    where: { id },
    data: { status: parsed.data.status },
  });

  return NextResponse.json({ success: true, data: order });
}
