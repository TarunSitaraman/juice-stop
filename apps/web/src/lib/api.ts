import type { Category, Order, CreateOrderPayload, ApiResponse } from "@juice-stop/shared";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...init?.headers },
    ...init,
  });
  const json: ApiResponse<T> = await res.json();
  if (!json.success) throw new Error((json as { error: string }).error);
  return (json as { success: true; data: T }).data;
}

export const api = {
  getMenu: () => apiFetch<Category[]>("/api/menu"),

  getOrder: (id: string) => apiFetch<Order>(`/api/orders/${id}`),

  getOrderByTicket: (ticketId: string) =>
    apiFetch<Pick<Order, "id" | "ticketId" | "status" | "totalAmount" | "createdAt" | "updatedAt">>(
      `/api/orders/ticket/${ticketId}`
    ),

  createOrder: (payload: CreateOrderPayload) =>
    apiFetch<Order>("/api/orders", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
