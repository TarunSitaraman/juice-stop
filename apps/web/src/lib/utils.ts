import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: string | number) {
  return `₹${Number(price).toFixed(2)}`;
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export const ORDER_STATUS_LABEL: Record<string, string> = {
  PENDING: "Order Received",
  IN_PREPARATION: "Being Prepared",
  SENT_FOR_DELIVERY: "Out for Delivery",
  COMPLETED: "Delivered",
  REJECTED: "Order Rejected",
};

export const ORDER_STATUS_COLOR: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  IN_PREPARATION: "bg-blue-100 text-blue-800",
  SENT_FOR_DELIVERY: "bg-purple-100 text-purple-800",
  COMPLETED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};
