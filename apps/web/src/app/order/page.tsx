"use client"

import { ProductRevealCard } from "@/components/ui/product-reveal-card"
import { menuItems, categories } from "@/lib/data"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { useCartStore } from "@/lib/store"

export default function OrderPage() {
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const addItemToCart = useCartStore(state => state.addItem);

  return (
    <div className="min-h-screen bg-black pt-28 pb-16 px-6 md:px-12 flex relative">
      <Tabs 
        defaultValue={categories[0]} 
        orientation="vertical" 
        className="flex w-full gap-8 max-w-7xl mx-auto flex-col md:flex-row"
        onValueChange={setActiveCategory}
      >
        {/* Sidebar */}
        <div className="md:w-64 shrink-0 mt-8">
          <TabsList className="flex flex-col rounded-none bg-transparent p-0 sticky top-32 items-start justify-start w-full">
            {categories.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="relative w-full justify-start rounded-none bg-transparent py-4 px-2 hover:bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none group text-left h-auto"
              >
                {/* Motion wrapper for fluid liquid text effect */}
                <motion.span 
                  className="text-xl md:text-2xl font-bold tracking-tight origin-left transition-colors text-white/50 group-hover:text-white group-data-[state=active]:text-blue-500 inline-block"
                  whileHover={{ 
                    scale: 1.15,
                    transition: { type: "spring", stiffness: 400, damping: 10, mass: 0.8 } 
                  }}
                >
                  {category}
                </motion.span>
                
                {/* Active Indicator line */}
                <motion.div 
                   className="absolute left-0 bottom-2 w-0 h-0.5 bg-blue-600 rounded-full"
                   animate={{ 
                     width: activeCategory === category ? '40%' : '0%',
                     opacity: activeCategory === category ? 1 : 0
                   }}
                   transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Content Area */}
        <div className="grow min-h-screen pl-0 md:pl-8">
          {categories.map((category) => (
            <TabsContent key={category} value={category} className="mt-0 outline-none w-full animate-in fade-in zoom-in-95 duration-500">
              <div className="mb-10">
                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4 uppercase" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  {category}
                </h2>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center w-full">
                {menuItems.filter(item => item.category === category).map((product, idx) => (
                  <ProductRevealCard 
                    key={idx} 
                    name={product.name} 
                    price={product.price} 
                    onAdd={() => addItemToCart(product)}
                    className="w-full bg-zinc-900 border-zinc-800 h-32" 
                  />
                ))}
              </div>
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  )
}
