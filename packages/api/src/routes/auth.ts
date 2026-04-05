import { Router } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "@juice-stop/db";
import { loginSchema } from "@juice-stop/shared";
import { signAccess, signRefresh, verifyRefresh } from "../lib/jwt";
import { getRedis } from "../lib/redis";

export const authRouter = Router();

// POST /api/auth/login
authRouter.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, error: "Invalid credentials" });
    return;
  }
  const { email, password } = parsed.data;
  const staff = await prisma.staff.findUnique({ where: { email } });
  if (!staff || !(await bcrypt.compare(password, staff.passwordHash))) {
    res.status(401).json({ success: false, error: "Invalid email or password" });
    return;
  }
  const payload = { staffId: staff.id, role: staff.role };
  const accessToken = signAccess(payload);
  const refreshToken = signRefresh(payload);

  // Store refresh token in Redis with 7-day TTL
  const redis = await getRedis();
  await redis.set(`refresh:${staff.id}`, refreshToken, { EX: 60 * 60 * 24 * 7 });

  res.json({
    success: true,
    data: {
      accessToken,
      refreshToken,
      staff: { id: staff.id, name: staff.name, email: staff.email, role: staff.role },
    },
  });
});

// POST /api/auth/refresh
authRouter.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body as { refreshToken?: string };
  if (!refreshToken) {
    res.status(400).json({ success: false, error: "Refresh token required" });
    return;
  }
  try {
    const payload = verifyRefresh(refreshToken);
    const redis = await getRedis();
    const stored = await redis.get(`refresh:${payload.staffId}`);
    if (stored !== refreshToken) {
      res.status(401).json({ success: false, error: "Refresh token revoked" });
      return;
    }
    const newAccess = signAccess({ staffId: payload.staffId, role: payload.role });
    res.json({ success: true, data: { accessToken: newAccess } });
  } catch {
    res.status(401).json({ success: false, error: "Invalid refresh token" });
  }
});

// POST /api/auth/logout
authRouter.post("/logout", async (req, res) => {
  const { staffId } = req.body as { staffId?: string };
  if (staffId) {
    const redis = await getRedis();
    await redis.del(`refresh:${staffId}`);
  }
  res.json({ success: true, data: null });
});
