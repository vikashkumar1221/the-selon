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
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0B0B0D] text-white min-h-screen flex flex-col antialiased selection:bg-gold selection:text-black">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <MobileBottomNav />
      </body>
    </html>
  );
}
