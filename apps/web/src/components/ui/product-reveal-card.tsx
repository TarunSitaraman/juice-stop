"use client"

import { motion } from "framer-motion"
import { buttonVariants } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProductRevealCardProps {
  name?: string
  price?: string
  onAdd?: () => void
  enableAnimations?: boolean
  className?: string
}

export function ProductRevealCard({
  name = "Premium Smoothie",
  price = "$6.99",
  onAdd,
  enableAnimations = true,
  className,
}: ProductRevealCardProps) {
  const containerVariants: any = {
    rest: { 
      scale: 1,
      y: 0,
    },
    hover: { 
      scale: 1.05, 
      y: -4,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
      }
    },
  };

  const overlayVariants: any = {
    rest: { 
      y: "100%", 
      opacity: 0,
    },
    hover: { 
      y: "0%", 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 30,
      },
    },
  };

  const buttonVariants_motion: any = {
    rest: { scale: 1, y: 0 },
    hover: { scale: 1.05, y: -2, transition: { type: "spring", stiffness: 400, damping: 25 } },
    tap: { scale: 0.95 },
  };

  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      variants={containerVariants}
      className={cn(
        "relative w-full rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden cursor-pointer group p-6 h-32 flex flex-col justify-center",
        className
      )}
    >
      {/* Content */}
      <div className="flex flex-col h-full justify-center text-center">
        <h3 className="text-lg font-bold leading-tight tracking-tight text-white mb-1">
          {name}
        </h3>
        <span className="text-base font-medium text-white/90">{price}</span>
      </div>

      {/* Reveal Overlay */}
      <motion.div
        variants={overlayVariants as any}
        className="absolute inset-0 z-20 bg-zinc-900/95 flex flex-col justify-center p-6"
      >
        <motion.button
          onClick={onAdd}
          variants={buttonVariants_motion as any}
          initial="rest"
          whileHover="hover"
          whileTap="tap"
          className={cn(
            buttonVariants({ variant: "default" }), 
            "relative z-30 w-full h-12 font-medium text-white",
            "bg-blue-800",
            "hover:bg-blue-900",
            "shadow-lg shadow-blue-900/40"
          )}
        >
          <ShoppingCart className="w-5 h-5 mr-3" />
          Add to Cart
        </motion.button>
      </motion.div>
    </motion.div>
  )
}
