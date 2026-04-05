import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@juice-stop/db";
import { requireAdminStaff } from "@/lib/auth-helper";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAdminStaff(req);
  if ("error" in auth) return auth.error;

  const { available } = await req.json() as { available?: boolean };
  if (typeof available !== "boolean") {
    return NextResponse.json({ success: false, error: "`available` must be a boolean" }, { status: 400 });
  }

  const { id } = await params;
  const item = await prisma.menuItem.update({ where: { id }, data: { available } });
  return NextResponse.json({ success: true, data: item });
}
