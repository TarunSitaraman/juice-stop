"use client";

import { useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { formatPrice, formatDate, ORDER_STATUS_LABEL, ORDER_STATUS_COLOR } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, Bike, XCircle, ChefHat, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { io } from "socket.io-client";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@juice-stop/shared";

const STATUS_ICON: Record<string, React.ReactNode> = {
  PENDING: <Clock className="w-8 h-8 text-yellow-500" />,
  IN_PREPARATION: <ChefHat className="w-8 h-8 text-blue-500" />,
  SENT_FOR_DELIVERY: <Bike className="w-8 h-8 text-purple-500" />,
  COMPLETED: <CheckCircle2 className="w-8 h-8 text-green-500" />,
  REJECTED: <XCircle className="w-8 h-8 text-red-500" />,
};

export default function OrderStatusPage() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const ticketId = searchParams.get("ticket");
  const queryClient = useQueryClient();

  const { data: order, isLoading } = useQuery({
    queryKey: ["order", id],
    queryFn: () => api.getOrder(id),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === "COMPLETED" || status === "REJECTED") return false;
      return 15_000; // poll every 15s as fallback
    },
  });

  // Real-time status updates via Socket.io
  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL ?? "");
    socket.emit("track_order", id);
    socket.on("order_updated", (event: { orderId: string; status: OrderStatus }) => {
      if (event.orderId === id) {
        queryClient.setQueryData(["order", id], (prev: typeof order) =>
          prev ? { ...prev, status: event.status } : prev
        );
      }
    });
    return () => { socket.disconnect(); };
  }, [id, queryClient]);

  if (isLoading) {
    return (
      <div className="text-center py-20 animate-pulse">
        <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4" />
        <div className="h-4 w-32 bg-gray-200 rounded mx-auto" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <p className="text-4xl mb-3">🔍</p>
        <p className="font-semibold text-gray-700">Order not found</p>
        <Link href="/"><Button variant="outline" className="mt-4">Go Home</Button></Link>
      </div>
    );
  }

  const isTerminal = order.status === "COMPLETED" || order.status === "REJECTED";

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/">
          <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
            <ArrowLeft className="w-4 h-4" />
          </button>
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Order Status</h1>
      </div>

      {/* Ticket + status hero */}
      <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-6 text-center mb-5">
        <div className="flex justify-center mb-3">
          {STATUS_ICON[order.status] ?? <Clock className="w-8 h-8 text-gray-400" />}
        </div>
        <div className="text-3xl font-black text-brand-500 mb-1">
          {ticketId ?? order.ticketId}
        </div>
        <span
          className={cn(
            "inline-block rounded-full px-3 py-1 text-xs font-semibold",
            ORDER_STATUS_COLOR[order.status] ?? "bg-gray-100 text-gray-700"
          )}
        >
          {ORDER_STATUS_LABEL[order.status] ?? order.status}
        </span>
        {!isTerminal && (
          <p className="text-xs text-gray-400 mt-3 animate-pulse">
            Checking for updates automatically…
          </p>
        )}
      </div>

      {/* Order details */}
      <div className="bg-white rounded-xl border border-orange-100 shadow-sm p-4 mb-4">
        <h2 className="font-semibold text-gray-800 mb-3">Items Ordered</h2>
        <div className="space-y-2">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-gray-700">
                {item.menuItem.name} × {item.quantity}
              </span>
              <span className="font-medium">
                {formatPrice(Number(item.unitPrice) * item.quantity)}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t mt-3 pt-3 flex justify-between font-bold">
          <span>Total</span>
          <span className="text-brand-600">{formatPrice(order.totalAmount)}</span>
        </div>
      </div>

      <div className="text-xs text-gray-400 text-center">
        Ordered at {formatDate(order.createdAt)}
      </div>

      <div className="mt-6 text-center">
        <Link href="/">
          <Button variant="outline">Order More</Button>
        </Link>
      </div>
    </div>
  );
}
