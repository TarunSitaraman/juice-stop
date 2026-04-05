import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@juice-stop/db";
import { requireStaff } from "@/lib/auth-helper";
import { put } from "@vercel/blob";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireStaff(req);
  if ("error" in auth) return auth.error;

  const { id } = await params;

  const formData = await req.formData();
  const file = formData.get("proof") as File | null;

  if (!file) {
    return NextResponse.json({ success: false, error: "No image file uploaded" }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ success: false, error: "Only image files are allowed" }, { status: 400 });
  }
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ success: false, error: "Image must be under 5MB" }, { status: 400 });
  }

  const ext = file.type.split("/")[1];
  const blob = await put(`proofs/${id}-${Date.now()}.${ext}`, file, {
    access: "public",
    contentType: file.type,
  });

  const order = await prisma.order.update({
    where: { id },
    data: { proofImageUrl: blob.url },
  });

  return NextResponse.json({ success: true, data: { proofImageUrl: order.proofImageUrl } });
}
