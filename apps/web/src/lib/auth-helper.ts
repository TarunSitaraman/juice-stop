import { NextRequest, NextResponse } from "next/server";
import { verifyAccess, type JwtPayload } from "./jwt";

export function getStaffFromRequest(req: NextRequest): JwtPayload | null {
  const header = req.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return null;
  try {
    return verifyAccess(header.slice(7));
  } catch {
    return null;
  }
}

export function requireStaff(req: NextRequest): { staff: JwtPayload } | { error: NextResponse } {
  const staff = getStaffFromRequest(req);
  if (!staff) {
    return {
      error: NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 }),
    };
  }
  return { staff };
}

export function requireAdminStaff(req: NextRequest): { staff: JwtPayload } | { error: NextResponse } {
  const result = requireStaff(req);
  if ("error" in result) return result;
  if (result.staff.role !== "ADMIN") {
    return {
      error: NextResponse.json({ success: false, error: "Admin access required" }, { status: 403 }),
    };
  }
  return result;
}
