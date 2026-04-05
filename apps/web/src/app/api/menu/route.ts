import { NextResponse } from "next/server";
import { prisma } from "@juice-stop/db";

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      items: {
        where: { available: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });
  return NextResponse.json({ success: true, data: categories });
}
