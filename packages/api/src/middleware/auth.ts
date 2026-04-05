import { Request, Response, NextFunction } from "express";
import { verifyAccess } from "../lib/jwt";

export interface AuthRequest extends Request {
  staff?: { staffId: string; role: string };
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ success: false, error: "Unauthorized" });
    return;
  }
  try {
    const payload = verifyAccess(header.slice(7));
    req.staff = payload;
    next();
  } catch {
    res.status(401).json({ success: false, error: "Invalid or expired token" });
  }
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  requireAuth(req, res, () => {
    if (req.staff?.role !== "ADMIN") {
      res.status(403).json({ success: false, error: "Admin access required" });
      return;
    }
    next();
  });
}
