import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import NavHeader from "@/components/ui/nav-header";

import { Component as EtheralShadow } from "@/components/ui/etheral-shadow";

export const metadata: Metadata = {
  title: "Juice Stop",
  description: "Fresh juices, shakes & smoothies delivered to your door",
};

export const viewport = {
  themeColor: "#1e3a8a", // Navy Blue
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black m-0 p-0 text-white min-h-screen antialiased">
        <Providers>
          <div className="min-h-screen flex flex-col relative w-full">
            <EtheralShadow
              sizing="fill"
              color="rgba(128, 128, 128, 1)"
              animation={{ scale: 100, speed: 90 }}
              noise={{ opacity: 1, scale: 1.2 }}
              className="flex-1 flex flex-col w-full min-h-screen"
            >
              <header className="absolute top-0 left-0 w-full z-50 bg-transparent pointer-events-none">
                <div className="w-full flex justify-center py-6 pointer-events-auto">
                  <NavHeader />
                </div>
              </header>
              <main className="flex-1 w-full h-full relative z-20">
                {children}
              </main>
            </EtheralShadow>
          </div>
        </Providers>
      </body>
    </html>
  );
}
