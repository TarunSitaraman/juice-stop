import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@juice-stop/db";
import bcrypt from "bcryptjs";
import { loginSchema } from "@juice-stop/shared";
import { signAccess, signRefresh } from "@/lib/jwt";
import { redis } from "@/lib/redis";

export async function POST(req: NextRequest) {
  const parsed = loginSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 400 });
  }

  const { email, password } = parsed.data;
  const staff = await prisma.staff.findUnique({ where: { email } });
  if (!staff || !(await bcrypt.compare(password, staff.passwordHash))) {
    return NextResponse.json({ success: false, error: "Invalid email or password" }, { status: 401 });
  }

  const payload = { staffId: staff.id, role: staff.role };
  const accessToken = signAccess(payload);
  const refreshToken = signRefresh(payload);

  await redis.set(`refresh:${staff.id}`, refreshToken, { ex: 60 * 60 * 24 * 7 });

  return NextResponse.json({
    success: true,
    data: {
      accessToken,
      refreshToken,
      staff: { id: staff.id, name: staff.name, email: staff.email, role: staff.role },
    },
  });
}
