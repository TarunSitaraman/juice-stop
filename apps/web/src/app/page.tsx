import { MenuGrid } from "@/components/menu/menu-grid";
import { Phone, MapPin, Clock } from "lucide-react";
import { HeroLanding } from "@/components/ui/hero-1";
import { Component as EtheralShadow } from "@/components/ui/etheral-shadow";

export default function HomePage() {
  return (
    <div className="bg-background min-h-screen">
      {/* 21st.dev Hero Landing Section */}
      <HeroLanding
        logo={{
          src: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?q=80&w=256&auto=format&fit=crop", // Orange fruit
          alt: "Juice Stop Logo",
          companyName: "Juice Stop",
        }}
        navigation={[
          { name: "Menu", href: "#menu" },
          { name: "Location", href: "#contact" },
        ]}
        loginText="Order Now"
        loginHref="#menu"
        title="Refresh Your Day with Juice Stop"
        description="Freshly squeezed juices, rich milkshakes, and healthy smoothies made to order right at College Residency."
        announcementBanner={{
          text: "🍊 Fresh seasonal fruits arrived today!",
          linkText: "See what's new",
          linkHref: "#menu"
        }}
        callToActions={[
          { text: "Explore Menu", href: "#menu", variant: "primary" },
          { text: "Contact Us", href: "#contact", variant: "secondary" },
        ]}
        gradientColors={{
          from: "oklch(0.7 0.2 50)",   // Orange-ish
          to: "oklch(0.65 0.25 10)"    // Red/Pink-ish
        }}
      />

      {/* Interstitial Etheral Shadow Effect Section */}
      <div className="relative w-full h-[40vh] my-10 overflow-hidden rounded-3xl mx-auto max-w-7xl">
         <EtheralShadow
            sizing="fill"
            color="rgba(249, 115, 22, 0.8)" // Orange shadow
            animation={{ scale: 80, speed: 70 }}
            noise={{ opacity: 0.8, scale: 1.5 }}
         />
         <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
           <h2 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg text-center px-4">
             100% Real Fruits. Zero Preservatives.
           </h2>
         </div>
      </div>

      {/* Menu Section */}
      <section id="menu" className="mx-auto max-w-7xl px-6 py-16 scroll-mt-20">
        <div className="mb-8 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">Our Menu</h2>
          <p className="text-base text-muted-foreground mt-3">
             Everything from pure fruit juices to indulgent thick shakes.
          </p>
        </div>
        <MenuGrid />
      </section>

      {/* Contact Section */}
      <section id="contact" className="mx-auto max-w-7xl px-6 py-16 scroll-mt-20 border-t border-border mt-10">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">Find Us Here</h2>
            <p className="text-muted-foreground mb-8">Drop by for a quick refreshment or pick up your daily smoothie.</p>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-lg">Location</p>
                  <p className="text-muted-foreground">Juice Stop Kiosk, College Residency Ground Floor</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-lg">Hours</p>
                  <p className="text-muted-foreground">Mon – Sat · 8:00 AM – 9:00 PM</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-lg">Phone</p>
                  <p className="text-muted-foreground">+91 98765 43210</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-3xl border border-border shadow-xl p-8 relative overflow-hidden">
             {/* Subdued shadow effect in card */}
             <div className="absolute inset-0 opacity-20 pointer-events-none">
                 <EtheralShadow
                    sizing="fill"
                    color="rgba(34, 197, 94, 0.4)" 
                    animation={{ scale: 30, speed: 40 }}
                 />
             </div>
             <div className="relative z-10 text-center space-y-6">
               <h3 className="text-2xl font-bold text-card-foreground">Ready to Order?</h3>
               <p className="text-muted-foreground">Skip the line and place your order ahead of time.</p>
               <button className="w-full rounded-full bg-primary py-3.5 px-6 font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all font-medium text-lg">
                 Call Now
               </button>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}
