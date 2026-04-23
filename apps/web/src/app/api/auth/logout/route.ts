import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function POST(req: NextRequest) {
  const { staffId } = await req.json() as { staffId?: string };
  if (staffId && redis) {
    await redis.del(`refresh:${staffId}`);
  }
  return NextResponse.json({ success: true, data: null });
}
