import { Router } from "express";
import { prisma } from "@juice-stop/db";
import { requireAdmin } from "../middleware/auth";

export const menuRouter = Router();

// GET /api/menu — full menu with categories and items
menuRouter.get("/", async (_req, res) => {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      items: {
        where: { available: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });
  res.json({ success: true, data: categories });
});

// GET /api/menu/categories — category list only
menuRouter.get("/categories", async (_req, res) => {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    select: { id: true, name: true, slug: true, sortOrder: true },
  });
  res.json({ success: true, data: categories });
});

// PATCH /api/menu/items/:id/availability — toggle item (admin only)
menuRouter.patch("/items/:id/availability", requireAdmin, async (req, res) => {
  const { available } = req.body as { available?: boolean };
  if (typeof available !== "boolean") {
    res.status(400).json({ success: false, error: "`available` must be a boolean" });
    return;
  }
  const item = await prisma.menuItem.update({
    where: { id: req.params.id },
    data: { available },
  });
  res.json({ success: true, data: item });
});
