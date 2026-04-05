import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@juice-stop/db";
import { requireStaff } from "@/lib/auth-helper";

export async function GET(req: NextRequest) {
  const auth = requireStaff(req);
  if ("error" in auth) return auth.error;

  const status = req.nextUrl.searchParams.get("status") ?? undefined;

  const orders = await prisma.order.findMany({
    where: status ? { status: status as never } : {},
    orderBy: { createdAt: "desc" },
    include: {
      items: { include: { menuItem: { select: { id: true, name: true, price: true } } } },
    },
  });
  return NextResponse.json({ success: true, data: orders });
}
