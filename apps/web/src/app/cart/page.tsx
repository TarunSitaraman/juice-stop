"use client"

import { useCartStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, ArrowRight, CheckCircle2, ChevronLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "form" | "success">("cart");
  const [formData, setFormData] = useState({ name: "", address: "", phone: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    if (checkoutStep === "cart") {
      setCheckoutStep("form");
    } else if (checkoutStep === "form") {
      if (!formData.name || !formData.address || !formData.phone) {
        alert("Please fill in all your details to place the order.");
        return;
      }
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setCheckoutStep("success");
        clearCart();
      }, 1500);
    }
  };

  if (!mounted) {
    return <div className="min-h-screen pt-40 px-6 md:px-12">Loading...</div>; // Hydration bypass
  }

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 md:px-12 flex flex-col max-w-5xl mx-auto w-full">
      <h1 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tight uppercase">
        {checkoutStep === "form" ? "Checkout" : "Your Cart"}
      </h1>

      {checkoutStep === "success" ? (
        <div className="flex flex-col items-center justify-center flex-1 space-y-6 mt-12 bg-black/40 backdrop-blur-md rounded-3xl border border-green-500/20 p-12 text-center">
          <CheckCircle2 className="w-24 h-24 text-green-500 mb-4" />
          <h2 className="text-4xl font-bold text-white">Order placed!</h2>
          <p className="text-xl text-zinc-400 max-w-lg">
            Thank you, {formData.name}. We are preparing your order and it will be delivered to <span className="text-zinc-200">{formData.address}</span>.
          </p>
          <p className="text-zinc-500">We will call you at {formData.phone} if we need anything.</p>
          <Link href="/order" className={cn(buttonVariants({ variant: "default" }), "bg-green-600 hover:bg-green-700 font-bold px-8 mt-6")}>
            Order More
          </Link>
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 space-y-6 mt-12 bg-black/40 backdrop-blur-md rounded-3xl border border-white/5 p-12">
          <div className="w-24 h-24 rounded-full bg-blue-900/20 flex items-center justify-center">
            <ShoppingCartIcon className="w-10 h-10 text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold text-white/80">Your cart is empty</h2>
          <p className="text-zinc-400 text-center max-w-md">Looks like you haven't added anything to your cart yet. Browse our order menu to discover fresh juices and meals!</p>
          <Link href="/order" className={cn(buttonVariants({ variant: "default" }), "bg-blue-600 hover:bg-blue-700 font-bold px-8 mt-4")}>
            Browse Menu
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-12 w-full">
          {/* Main Content Area */}
          <div className="flex-1 space-y-4">
            <AnimatePresence mode="wait">
              {checkoutStep === "cart" ? (
                <motion.div
                  key="cart-items"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <AnimatePresence mode="popLayout">
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, x: -20 }}
                        className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 md:p-6 flex flex-col sm:flex-row items-center gap-6"
                      >
                        <div className="flex-1 text-center sm:text-left">
                          <h3 className="text-xl font-bold text-white">{item.name}</h3>
                          <p className="text-blue-400 font-medium">₹{item.price.toFixed(2)} each</p>
                        </div>

                        <div className="flex items-center gap-4 border border-white/10 bg-zinc-900/80 rounded-full p-1 max-w-fit mx-auto sm:mx-0">
                          <div className="flex items-center">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-bold text-white">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors border-r border-white/10 mr-2 pr-2"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="flex items-center gap-4 pl-2 pr-1">
                            <span className="text-xl font-black text-white w-20 text-center">₹{(item.price * item.quantity).toFixed(2)}</span>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-red-400/80 hover:text-red-400 hover:bg-red-400/10 p-2 rounded-full transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  <div className="w-full flex justify-end mt-4">
                    <button onClick={clearCart} className="text-sm text-zinc-500 hover:text-red-400 transition-colors">Clear Entire Cart</button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="checkout-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-8 space-y-6"
                >
                  <div className="flex items-center mb-6">
                    <button
                      onClick={() => setCheckoutStep("cart")}
                      className="mr-4 p-2 rounded-full hover:bg-white/10 text-white transition-colors"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <h2 className="text-2xl font-bold text-white">Delivery Details</h2>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-2">Full Name</label>
                      <input
                        required
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium placeholder:text-zinc-600"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-2">Phone Number</label>
                      <input
                        required
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium placeholder:text-zinc-600"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-2">Delivery Address</label>
                      <textarea
                        required
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all min-h-[120px] resize-none font-medium placeholder:text-zinc-600"
                        placeholder="123 Street Name, Area..."
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Checkout Summary */}
          <div className="w-full lg:w-96 rounded-3xl bg-blue-900/10 border border-blue-500/20 backdrop-blur-xl p-8 h-fit lg:sticky top-32">
            <h3 className="text-2xl font-bold mb-6 text-white text-center">Order Summary</h3>

            <div className="space-y-4 text-zinc-300">
              <div className="flex justify-between">
                <span>Subtotal ({items.reduce((acc, i) => acc + i.quantity, 0)} items)</span>
                <span className="font-medium text-white">₹{total.toFixed(2)}</span>
              </div>
              <div className="w-full h-px bg-white/10 my-4" />
              <div className="flex justify-between text-xl">
                <span className="font-bold text-white">Total</span>
                <span className="font-black text-blue-400">₹{total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isSubmitting}
              className={cn(
                "w-full mt-8 bg-blue-600 hover:bg-blue-500 hover:ring-4 ring-blue-600/30 text-white font-bold h-14 rounded-xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-900/50",
                isSubmitting && "opacity-70 cursor-not-allowed"
              )}
            >
              {checkoutStep === "cart" ? (
                <>Checkout <ArrowRight className="w-5 h-5" /></>
              ) : isSubmitting ? (
                <>Processing...</>
              ) : (
                <>Place Order <CheckCircle2 className="w-5 h-5" /></>
              )}
            </button>

            <p className="text-center text-xs text-zinc-500 mt-4">Shipping calculated at checkout. Taxes included.</p>
          </div>
        </div>
      )}
    </div>
  );
}

function ShoppingCartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  );
}
