import { MenuGrid } from "@/components/menu/menu-grid";
import { Phone, MapPin, Clock } from "lucide-react";

export default function HomePage() {
  return (
    <div>
      <section id="home">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Our Menu</h1>
          <p className="text-sm text-gray-500 mt-1">
            Fresh juices, shakes &amp; smoothies made to order
          </p>
        </div>
        <MenuGrid />
      </section>

      <section id="contact" className="mt-16 scroll-mt-20">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Us</h2>
        <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-6 space-y-4">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-brand-500 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-gray-800">Location</p>
              <p className="text-sm text-gray-500">Juice Stop Kiosk, College Residency Ground Floor</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-brand-500 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-gray-800">Hours</p>
              <p className="text-sm text-gray-500">Mon – Sat · 8 AM – 9 PM</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-brand-500 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-gray-800">Phone</p>
              <p className="text-sm text-gray-500">+91 98765 43210</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
