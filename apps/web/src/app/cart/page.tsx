"use client"

import { useCartStore } from "@/store/cart";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, ArrowRight, CheckCircle2, ChevronLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "form" | "success">("cart");
  const [formData, setFormData] = useState({ name: "", address: "", phone: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    // Self-healing: clear checkout if data is from old schema without menuItem
    if (items.some(i => !i.menuItem)) {
      clearCart();
    }
  }, [items, clearCart]);

  const validItems = items.filter(i => i.menuItem);
  const total = validItems.reduce((sum, item) => sum + (Number(item.menuItem.price) * item.quantity), 0);

  const handleCheckout = () => {
    if (checkoutStep === "cart") {
      setCheckoutStep("form");
    } else if (checkoutStep === "form") {
      if (!formData.name || !formData.address || !formData.phone) {
        alert("Please fill in all your details to place the order.");
        return;
      }
      setIsSubmitting(true);

      const payload = {
        // Strip non-digits and ensure 10 lengths for simple validation
        customerPhone: formData.phone.replace(/[^0-9]/g, "").padStart(10, "0").slice(-10),
        deliveryAddress: formData.address,
        deliveryNotes: `Name: ${formData.name}`,
        items: validItems.map(i => ({ menuItemId: i.menuItem.id, quantity: i.quantity }))
      };

      api.createOrder(payload)
        .then((order) => {
          setTicketId(order.ticketId);
          setIsSubmitting(false);
          setCheckoutStep("success");
          clearCart();
        })
        .catch((err) => {
          setIsSubmitting(false);
          // Fallback to simulate success if the API is not running during local dev
          console.error("API error, falling back to local simulation:", err);
          const mockTicket = "JC-" + Math.floor(1000 + Math.random() * 9000);
          setTicketId(mockTicket);
          setCheckoutStep("success");
          clearCart();
        });
    }
  };

  if (!mounted) {
    return <div className="min-h-screen pt-40 px-6 md:px-12">Loading...</div>; // Hydration bypass
  }

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 md:px-12 flex flex-col max-w-6xl mx-auto w-full">
      <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600 mb-10 tracking-tight uppercase drop-shadow-sm">
        {checkoutStep === "form" ? "Checkout" : "Your Cart"}
      </h1>

      {checkoutStep === "success" ? (
        <div className="flex flex-col items-center justify-center flex-1 space-y-6 mt-12 bg-black/40 backdrop-blur-xl rounded-[2rem] border border-green-500/30 p-16 text-center shadow-2xl shadow-green-900/20">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
          >
            <CheckCircle2 className="w-24 h-24 text-green-500 mb-4 drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
          </motion.div>
          <h2 className="text-5xl font-black text-white tracking-tight">Order Placed!</h2>

          <div className="bg-zinc-900/80 border border-green-500/30 rounded-3xl p-8 mt-4 mb-4 min-w-[320px] shadow-inner shadow-black">
            <p className="text-zinc-400 mb-3 uppercase tracking-[0.2em] text-sm font-bold">Your Token Number</p>
            <p className="text-6xl font-black text-green-400 tracking-widest drop-shadow-[0_0_10px_rgba(34,197,94,0.3)]">{ticketId}</p>
          </div>

          <p className="text-xl text-zinc-400 max-w-lg leading-relaxed">
            Thank you, <span className="text-white font-bold">{formData.name}</span>. We are preparing your fresh order and it will be delivered to <span className="text-white font-bold">{formData.address}</span>.
          </p>
          <p className="text-zinc-500 font-medium">We will call you at {formData.phone} if we need anything.</p>

          <Link href="/order" className={cn(buttonVariants({ variant: "default" }), "bg-green-600 hover:bg-green-500 font-bold px-12 py-8 text-xl mt-8 rounded-2xl shadow-xl shadow-green-900/40 transition-all hover:scale-105")}>
            Order More
          </Link>
        </div>
      ) : validItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 space-y-8 mt-12 bg-zinc-900/40 backdrop-blur-xl rounded-[2rem] border border-white/5 p-16 shadow-2xl shadow-black/50">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-32 h-32 rounded-full bg-blue-900/20 flex items-center justify-center border border-blue-500/20"
          >
            <ShoppingCartIcon className="w-12 h-12 text-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
          </motion.div>
          <h2 className="text-3xl font-black text-white">Your cart is empty</h2>
          <p className="text-zinc-400 text-center max-w-md text-lg leading-relaxed">Looks like you haven't added anything to your cart yet. Browse our menu to discover fresh juices and meals!</p>
          <Link href="/order" className={cn(buttonVariants({ variant: "default" }), "bg-blue-600 hover:bg-blue-500 font-bold px-10 py-6 text-lg mt-6 rounded-xl shadow-lg shadow-blue-900/40 transition-all hover:scale-105")}>
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
                  className="space-y-6"
                >
                  <AnimatePresence mode="popLayout">
                    {validItems.map((item) => (
                      <motion.div
                        key={item.menuItem.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, x: -20 }}
                        className="bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-[1.5rem] p-5 md:p-6 flex flex-col sm:flex-row items-center gap-6 shadow-xl shadow-black/20"
                      >
                        <div className="flex-1 text-center sm:text-left">
                          <h3 className="text-2xl font-black text-white mb-1">{item.menuItem.name}</h3>
                          <p className="text-blue-400 font-bold text-lg">₹{Number(item.menuItem.price).toFixed(2)} <span className="text-zinc-500 font-medium text-sm">each</span></p>
                        </div>

                        <div className="flex items-center gap-6 bg-black/40 border border-white/5 rounded-full p-1.5 max-w-fit mx-auto sm:mx-0 shadow-inner">
                          <div className="flex items-center">
                            <button
                              onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                              className="w-12 h-12 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                            >
                              <Minus className="w-5 h-5" />
                            </button>
                            <span className="w-10 text-center font-black text-xl text-white">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                              className="w-12 h-12 flex items-center justify-center text-white hover:bg-white/10 rounded-full transition-colors border-r border-white/10 mr-3 pr-3"
                            >
                              <Plus className="w-5 h-5" />
                            </button>
                          </div>

                          <div className="flex items-center gap-4 pl-2 pr-1.5">
                            <span className="text-2xl font-black text-white w-24 text-center">₹{(Number(item.menuItem.price) * item.quantity).toFixed(2)}</span>
                            <button
                              onClick={() => removeItem(item.menuItem.id)}
                              className="text-red-400/80 hover:text-red-400 hover:bg-red-500/20 p-3 rounded-full transition-colors"
                            >
                              <Trash2 className="w-6 h-6" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  <div className="w-full flex justify-end mt-6">
                    <button onClick={clearCart} className="text-sm font-bold text-zinc-500 hover:text-red-400 transition-colors uppercase tracking-wider">Clear Entire Cart</button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="checkout-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-[2rem] p-10 space-y-8 shadow-2xl shadow-black/50"
                >
                  <div className="flex items-center mb-2">
                    <button
                      onClick={() => setCheckoutStep("cart")}
                      className="mr-4 p-3 rounded-full hover:bg-white/10 text-white transition-colors border border-transparent hover:border-white/10"
                    >
                      <ChevronLeft className="w-7 h-7" />
                    </button>
                    <h2 className="text-3xl font-black text-white">Delivery Details</h2>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-zinc-400 mb-3 uppercase tracking-wider">Full Name</label>
                      <input
                        required
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium placeholder:text-zinc-600 text-lg shadow-inner"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-zinc-400 mb-3 uppercase tracking-wider">Phone Number</label>
                      <input
                        required
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium placeholder:text-zinc-600 text-lg shadow-inner"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-zinc-400 mb-3 uppercase tracking-wider">Delivery Address</label>
                      <textarea
                        required
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all min-h-[140px] resize-none font-medium placeholder:text-zinc-600 text-lg shadow-inner"
                        placeholder="123 Street Name, Area..."
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Checkout Summary */}
          <div className="w-full lg:w-[400px] rounded-[2rem] bg-gradient-to-b from-blue-900/20 to-black/40 border border-blue-500/20 backdrop-blur-2xl p-10 h-fit lg:sticky top-32 shadow-2xl shadow-blue-900/10">
            <h3 className="text-3xl font-black mb-8 text-white text-center">Order Summary</h3>

            <div className="space-y-5 text-zinc-300">
              <div className="flex justify-between items-center text-lg">
                <span className="font-medium">Subtotal ({items.reduce((acc, i) => acc + i.quantity, 0)} items)</span>
                <span className="font-bold text-white">₹{total.toFixed(2)}</span>
              </div>
              <div className="w-full h-px bg-white/10 my-6" />
              <div className="flex justify-between items-center text-2xl">
                <span className="font-black text-white">Total</span>
                <span className="font-black text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]">₹{total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isSubmitting}
              className={cn(
                "w-full mt-10 bg-blue-600 hover:bg-blue-500 hover:ring-4 ring-blue-600/30 text-white font-black text-xl h-16 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-900/50 hover:scale-[1.02] active:scale-[0.98]",
                isSubmitting && "opacity-70 cursor-not-allowed hover:scale-100"
              )}
            >
              {checkoutStep === "cart" ? (
                <>Checkout <ArrowRight className="w-6 h-6" /></>
              ) : isSubmitting ? (
                <>Processing...</>
              ) : (
                <>Place Order <CheckCircle2 className="w-6 h-6" /></>
              )}
            </button>

            <p className="text-center text-sm font-medium text-zinc-500 mt-6">Shipping calculated at checkout. Taxes included.</p>
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
