import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "Juice Stop",
  description: "Fresh juices, shakes & smoothies delivered to your door",
  themeColor: "#f97316",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <header className="bg-brand-500 text-white shadow-md sticky top-0 z-40">
              <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🧃</span>
                  <span className="font-bold text-xl tracking-tight">Juice Stop</span>
                </div>
                <span className="text-sm text-orange-100">Fresh · Fast · Delivered</span>
              </div>
            </header>
            <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
              {children}
            </main>
            <footer className="text-center text-xs text-gray-400 py-4">
              © {new Date().getFullYear()} Juice Stop · College Residency
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
