import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";

export const metadata: Metadata = {
  title: "SalonX – Luxury Multi-Salon Booking & Live Queue Platform",
  description:
    "Discover premier luxury salons, book bespoke appointments, and track your live queue time in real time with SalonX.",
  keywords: [
    "luxury salon",
    "barbershop booking",
    "live queue tracker",
    "haircut appointment",
    "grooming",
    "salonx",
    "the sello",
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
        {/* Ambient atmospheric backdrop glows */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute -top-40 right-1/4 w-[500px] h-[500px] rounded-full bg-gold/10 blur-[130px] opacity-70 animate-glow" />
          <div className="absolute top-[35%] -left-48 w-[550px] h-[550px] rounded-full bg-[#967425]/10 blur-[150px] opacity-50" />
          <div className="absolute top-[70%] right-[-100px] w-[600px] h-[600px] rounded-full bg-gold/8 blur-[160px] opacity-60" />
        </div>

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
