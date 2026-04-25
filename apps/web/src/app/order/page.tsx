"use client"

import { ProductRevealCard } from "@/components/ui/product-reveal-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { useCartStore } from "@/store/cart"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { formatPrice } from "@/lib/utils"
import { CartDrawer } from "@/components/cart/cart-drawer"

export default function OrderPage() {
  const { data: categories, isLoading, error } = useQuery({
    queryKey: ["menu"],
    queryFn: api.getMenu,
    staleTime: 60_000,
  });

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const addItemToCart = useCartStore(state => state.addItem);

  useEffect(() => {
    if (categories && categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0].name);
    }
  }, [categories, activeCategory]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black pt-40 px-6 md:px-12 flex items-center justify-center">
        <p className="text-white">Loading menu...</p>
      </div>
    );
  }

  if (error || !categories) {
    return (
      <div className="min-h-screen bg-black pt-40 px-6 md:px-12 flex items-center justify-center">
        <p className="text-red-400">Error loading menu. Please try again.</p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-black pt-28 pb-32 px-6 md:px-12 flex relative">
        <Tabs 
          value={activeCategory || ""} 
          orientation="vertical" 
          className="flex w-full gap-8 max-w-7xl mx-auto flex-col md:flex-row"
          onValueChange={setActiveCategory}
        >
          {/* Sidebar */}
          <div className="md:w-64 shrink-0 mt-8">
            <TabsList className="flex flex-col rounded-none bg-transparent p-0 sticky top-32 items-start justify-start w-full">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.name}
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
                    {category.name}
                  </motion.span>
                  
                  {/* Active Indicator line */}
                  <motion.div 
                     className="absolute left-0 bottom-2 w-0 h-0.5 bg-blue-600 rounded-full"
                     animate={{ 
                       width: activeCategory === category.name ? '40%' : '0%',
                       opacity: activeCategory === category.name ? 1 : 0
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
              <TabsContent key={category.id} value={category.name} className="mt-0 outline-none w-full animate-in fade-in zoom-in-95 duration-500">
                <div className="mb-10">
                  <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4 uppercase" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    {category.name}
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center w-full">
                  {category.items.map((product, idx) => (
                    <ProductRevealCard 
                      key={product.id || idx} 
                      name={product.name} 
                      description={product.description}
                      imageUrl={product.imageUrl}
                      price={formatPrice(product.price)} 
                      onAdd={() => addItemToCart(product)}
                      className="w-full" 
                    />
                  ))}
                </div>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
      <CartDrawer />
    </>
  )
}
