import { NextRequest, NextResponse } from "next/server";
import { verifyRefresh, signAccess } from "@/lib/jwt";
import { redis } from "@/lib/redis";

export async function POST(req: NextRequest) {
  const { refreshToken } = await req.json() as { refreshToken?: string };
  if (!refreshToken) {
    return NextResponse.json({ success: false, error: "Refresh token required" }, { status: 400 });
  }
  try {
    const payload = verifyRefresh(refreshToken);
    if (redis) {
      const stored = await redis.get(`refresh:${payload.staffId}`);
      if (stored !== refreshToken) {
        return NextResponse.json({ success: false, error: "Refresh token revoked" }, { status: 401 });
      }
    }
    const accessToken = signAccess({ staffId: payload.staffId, role: payload.role });
    return NextResponse.json({ success: true, data: { accessToken } });
  } catch {
    return NextResponse.json({ success: false, error: "Invalid refresh token" }, { status: 401 });
  }
}
