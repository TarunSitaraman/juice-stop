import jwt from "jsonwebtoken";

export interface JwtPayload {
  staffId: string;
  role: string;
}

export function signAccess(payload: JwtPayload) {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "8h" });
}

export function signRefresh(payload: JwtPayload) {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, { expiresIn: "7d" });
}

export function verifyAccess(token: string): JwtPayload {
  return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
}

export function verifyRefresh(token: string): JwtPayload {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as JwtPayload;
}
