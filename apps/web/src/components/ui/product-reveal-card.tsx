"use client"

import { motion } from "framer-motion"
import { buttonVariants } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProductRevealCardProps {
  name?: string
  description?: string | null
  price?: string
  imageUrl?: string | null
  onAdd?: () => void
  enableAnimations?: boolean
  className?: string
}

export function ProductRevealCard({
  name = "Premium Smoothie",
  description = "A delicious blend of fresh fruits and natural sweetness.",
  price = "$6.99",
  imageUrl,
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
      scale: 1.02, 
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

  // Fallback gradient if no image
  const bgStyle = imageUrl 
    ? { backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%)' };

  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      variants={containerVariants}
      className={cn(
        "relative w-full rounded-3xl border border-white/10 bg-zinc-900/50 backdrop-blur-sm overflow-hidden cursor-pointer group h-64 flex flex-col shadow-xl",
        className
      )}
    >
      {/* Background Image or Gradient */}
      <div 
        className="absolute inset-0 z-0 transition-transform duration-700 group-hover:scale-110 opacity-60 mix-blend-overlay"
        style={bgStyle}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full justify-end p-6">
        <h3 className="text-2xl font-black leading-tight tracking-tight text-white mb-1 drop-shadow-md">
          {name}
        </h3>
        {description && (
          <p className="text-sm text-zinc-300 line-clamp-2 mb-2 font-medium drop-shadow-md">
            {description}
          </p>
        )}
        <span className="text-xl font-bold text-blue-400 drop-shadow-md">{price}</span>
      </div>

      {/* Reveal Overlay */}
      <motion.div
        variants={overlayVariants as any}
        className="absolute inset-0 z-20 bg-black/80 backdrop-blur-md flex flex-col justify-center p-6 border-t border-white/10"
      >
        <motion.button
          onClick={onAdd}
          variants={buttonVariants_motion as any}
          initial="rest"
          whileHover="hover"
          whileTap="tap"
          className={cn(
            buttonVariants({ variant: "default" }), 
            "relative z-30 w-full h-14 rounded-xl font-bold text-white text-lg",
            "bg-blue-600",
            "hover:bg-blue-500",
            "shadow-xl shadow-blue-900/50"
          )}
        >
          <ShoppingCart className="w-5 h-5 mr-3" />
          Add to Order
        </motion.button>
      </motion.div>
    </motion.div>
  )
}
