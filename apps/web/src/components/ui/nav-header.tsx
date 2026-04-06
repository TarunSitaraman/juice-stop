"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/lib/store";

const TABS = [
  { label: "Home", href: "/" },
  { label: "Order", href: "/order" },
  { label: "Cart", href: "/cart" },
];

export default function NavHeader() {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState(TABS[0].label);

  const cartItems = useCartStore((state) => state.items);
  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const currentTab = TABS.find((tab) => tab.href === pathname);
    if (currentTab) {
      setActiveTab(currentTab.label);
    }
  }, [pathname]);

  return (
    <nav className="flex items-center space-x-1 sm:space-x-2 bg-zinc-900/40 p-1 sm:p-2 border border-white/10 rounded-full shadow-2xl shadow-blue-900/20 backdrop-blur-md">
      {TABS.map((tab) => (
        <Link key={tab.label} href={tab.href}>
          <div
            onClick={() => setActiveTab(tab.label)}
            className={cn(
              "relative px-4 sm:px-6 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer",
              activeTab === tab.label
                ? "text-white"
                : "text-zinc-400 hover:text-white"
            )}
          >
            {activeTab === tab.label && (
              <motion.div
                layoutId="nav-pill"
                className="absolute inset-0 bg-blue-800 rounded-full -z-10"
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              {tab.label}
              {tab.label === "Cart" && mounted && cartItemCount > 0 && (
                <span className="bg-white text-blue-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                  {cartItemCount}
                </span>
              )}
            </span>
          </div>
        </Link>
      ))}
    </nav>
  );
}
