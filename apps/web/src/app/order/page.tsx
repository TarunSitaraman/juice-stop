"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { createOrderSchema } from "@juice-stop/shared";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, MapPin, Phone, FileText } from "lucide-react";
import Link from "next/link";

export default function OrderPage() {
  const router = useRouter();
  const { items, totalAmount, clearCart } = useCartStore();
  const [form, setForm] = useState({ customerPhone: "", deliveryAddress: "", deliveryNotes: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-4xl mb-3">🛒</p>
        <p className="font-semibold text-gray-700">Your cart is empty</p>
        <Link href="/" className="mt-4 inline-block">
          <Button variant="outline" className="mt-4">Browse Menu</Button>
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const payload = {
      customerPhone: form.customerPhone,
      deliveryAddress: form.deliveryAddress,
      deliveryNotes: form.deliveryNotes || undefined,
      items: items.map((i) => ({ menuItemId: i.menuItem.id, quantity: i.quantity })),
    };

    const parsed = createOrderSchema.safeParse(payload);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const [key, msgs] of Object.entries(parsed.error.flatten().fieldErrors)) {
        fieldErrors[key] = (msgs as string[])[0] ?? "";
      }
      setErrors(fieldErrors);
      return;
    }

    try {
      setSubmitting(true);
      const order = await api.createOrder(payload);
      clearCart();
      router.push(`/order/${order.id}?ticket=${order.ticketId}`);
    } catch (err) {
      setErrors({ form: err instanceof Error ? err.message : "Failed to place order" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/">
          <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
            <ArrowLeft className="w-4 h-4" />
          </button>
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Place Order</h1>
      </div>

      {/* Order summary */}
      <div className="bg-white rounded-xl border border-orange-100 p-4 mb-5 shadow-sm">
        <h2 className="font-semibold text-gray-800 mb-3">Order Summary</h2>
        <div className="space-y-2">
          {items.map(({ menuItem, quantity }) => (
            <div key={menuItem.id} className="flex justify-between text-sm">
              <span className="text-gray-700">
                {menuItem.name} × {quantity}
              </span>
              <span className="font-medium">{formatPrice(Number(menuItem.price) * quantity)}</span>
            </div>
          ))}
        </div>
        <div className="border-t mt-3 pt-3 flex justify-between font-bold">
          <span>Total</span>
          <span className="text-brand-600">{formatPrice(totalAmount())}</span>
        </div>
        <p className="text-xs text-gray-400 mt-2">Cash on delivery · UPI accepted</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Phone className="w-3.5 h-3.5 inline mr-1" />
            Phone Number
          </label>
          <input
            type="tel"
            inputMode="numeric"
            maxLength={10}
            placeholder="10-digit mobile number"
            value={form.customerPhone}
            onChange={(e) => setForm((f) => ({ ...f, customerPhone: e.target.value.replace(/\D/g, "") }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
          />
          {errors.customerPhone && (
            <p className="text-xs text-red-500 mt-1">{errors.customerPhone}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <MapPin className="w-3.5 h-3.5 inline mr-1" />
            Delivery Address
          </label>
          <textarea
            rows={3}
            placeholder="Room number, block, floor — be specific"
            value={form.deliveryAddress}
            onChange={(e) => setForm((f) => ({ ...f, deliveryAddress: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent resize-none"
          />
          {errors.deliveryAddress && (
            <p className="text-xs text-red-500 mt-1">{errors.deliveryAddress}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <FileText className="w-3.5 h-3.5 inline mr-1" />
            Delivery Notes <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            placeholder="e.g. No ice, extra sweet"
            value={form.deliveryNotes}
            onChange={(e) => setForm((f) => ({ ...f, deliveryNotes: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
          />
        </div>

        {errors.form && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 text-sm text-red-700">
            {errors.form}
          </div>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Placing Order...
            </>
          ) : (
            "Confirm Order"
          )}
        </Button>
      </form>
    </div>
  );
}
