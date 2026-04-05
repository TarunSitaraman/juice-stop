import { z } from "zod";

export const createOrderSchema = z.object({
  customerPhone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  deliveryAddress: z
    .string()
    .min(10, "Address must be at least 10 characters")
    .max(300, "Address too long"),
  deliveryNotes: z.string().max(200).optional(),
  items: z
    .array(
      z.object({
        menuItemId: z.string().min(1),
        quantity: z.number().int().min(1).max(20),
      })
    )
    .min(1, "Cart cannot be empty")
    .max(20, "Too many items in one order"),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    "PENDING",
    "IN_PREPARATION",
    "SENT_FOR_DELIVERY",
    "COMPLETED",
    "REJECTED",
  ]),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
