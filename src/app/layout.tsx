import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";

export const metadata: Metadata = {
  title: "The Sello – Luxury Multi-Salon Booking & Live Queue Platform",
  description:
    "Discover premier luxury salons, book bespoke appointments, and track your live queue time in real time with The Sello.",
  keywords: [
    "luxury salon",
    "the sello",
    "barbershop booking",
    "live queue tracker",
    "haircut appointment",
    "grooming",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-[#08080B] text-[#F4F4F5] min-h-screen flex flex-col antialiased selection:bg-gold selection:text-black relative overflow-x-hidden">
        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <MobileBottomNav />
        </div>
      </body>
    </html>
  );
}
