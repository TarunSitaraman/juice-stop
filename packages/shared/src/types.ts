// Shared TypeScript types across web, mobile, and API
// Single source of truth — do not duplicate in individual packages

export type OrderStatus =
  | "PENDING"
  | "IN_PREPARATION"
  | "SENT_FOR_DELIVERY"
  | "COMPLETED"
  | "REJECTED";

export type StaffRole = "ADMIN" | "STAFF";

// ─── Menu ────────────────────────────────────────────────────────────────────

export interface Category {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  items: MenuItem[];
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  description: string | null;
  price: string; // Decimal serialized as string to avoid float precision issues
  imageUrl: string | null;
  available: boolean;
  sortOrder: number;
}

// ─── Orders ──────────────────────────────────────────────────────────────────

export interface OrderItem {
  id: string;
  menuItemId: string;
  menuItem: Pick<MenuItem, "id" | "name" | "price">;
  quantity: number;
  unitPrice: string;
}

export interface Order {
  id: string;
  ticketId: string; // e.g. JC-0001
  customerPhone: string;
  deliveryAddress: string;
  deliveryNotes: string | null;
  status: OrderStatus;
  proofImageUrl: string | null;
  totalAmount: string;
  createdAt: string; // ISO string
  updatedAt: string;
  items: OrderItem[];
}

// Subset returned to customers (no internal IDs on items)
export type OrderSummary = Pick<
  Order,
  "id" | "ticketId" | "status" | "totalAmount" | "createdAt" | "updatedAt"
>;

// ─── Staff ───────────────────────────────────────────────────────────────────

export interface Staff {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  createdAt: string;
}

// ─── API Payloads ─────────────────────────────────────────────────────────────

export interface CreateOrderPayload {
  customerPhone: string;
  deliveryAddress: string;
  deliveryNotes?: string;
  items: {
    menuItemId: string;
    quantity: number;
  }[];
}

export interface UpdateOrderStatusPayload {
  status: OrderStatus;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// ─── API Responses ────────────────────────────────────────────────────────────

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: string;
  details?: Record<string, string[]>;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// ─── Socket Events ────────────────────────────────────────────────────────────

export interface SocketNewOrderEvent {
  order: Order;
}

export interface SocketOrderUpdatedEvent {
  orderId: string;
  ticketId: string;
  status: OrderStatus;
}
