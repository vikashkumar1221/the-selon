"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Clock,
  Star,
  Sparkles,
  Flame,
  ArrowRight,
  MapPin,
  Calendar,
  Search,
} from "lucide-react";
import { useSalonStore } from "@/lib/store/salonStore";

export default function HomePage() {
  const { salons } = useSalonStore();
  const activeSalons = salons.filter((s) => s.status === "active");

  const serviceCategories = [
    { name: "Haircut", label: "Precision Haircut" },
    { name: "Beard Trimming", label: "Straight Razor Shave" },
    { name: "Spa", label: "Japanese Head Spa" },
    { name: "Facial", label: "Detox Facial" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#08080B] text-[#F4F4F5]">
      {/* 1. HERO SECTION - CLEAN & OPEN LUXURY SALON VIEW */}
      <section className="relative min-h-[75vh] sm:min-h-[82vh] flex items-center justify-center overflow-hidden pt-12 pb-20">
        {/* Background Image: Authentic Luxury Salon & Chairs */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2400&auto=format&fit=crop"
            alt="Premier Luxury Salon & Barbershop Interior"
            fill
            priority
            className="object-cover object-center scale-100 opacity-80"
          />
          {/* Subtle gradient overlay so salon interior is clearly visible */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#08080B] via-[#08080B]/40 to-[#08080B]/60" />
        </div>

        {/* Hero Content - Direct & Uncluttered */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] drop-shadow-lg">
            Your Style. <span className="text-gold-gradient">Zero Waiting.</span>
          </h1>

          <p className="max-w-xl mx-auto text-base sm:text-lg text-white/90 font-medium drop-shadow-md">
            Discover verified luxury salons and track your live queue in real time.
          </p>

          {/* Service Category Quick Pills */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto">
            {serviceCategories.map((cat) => (
              <Link
                key={cat.name}
                href={`/salons?category=${encodeURIComponent(cat.name)}`}
                className="px-4 py-2 rounded-xl bg-[#121217]/85 border border-white/[0.12] hover:border-gold text-xs text-[#E4E4E7] hover:text-white transition-all shadow-lg backdrop-blur-md hover:bg-gold/10 hover:shadow-gold"
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 2. FEATURED LUXURY SALONS - DIRECT & VISUAL */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs text-gold font-semibold uppercase tracking-wider mb-2">
              <Flame className="w-4 h-4 text-gold" />
              <span>Curated Sanctuaries</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Featured Luxury Salons
            </h2>
            <p className="text-xs text-[#71717A] mt-1">
              Verified high-end barber shops and couture hair ateliers.
            </p>
          </div>
          <Link
            href="/salons"
            className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-gold hover:text-white transition-colors mt-4 md:mt-0"
          >
            <span>View All 25+ Salons</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Link>
        </div>

        {/* Salon Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeSalons.slice(0, 3).map((salon) => {
            const haircutService = salon.services.find(
              (s) =>
                s.category.toLowerCase().includes("hair") ||
                s.name.toLowerCase().includes("hair") ||
                s.name.toLowerCase().includes("cut")
            );
            const beardService = salon.services.find(
              (s) =>
                s.category.toLowerCase().includes("beard") ||
                s.name.toLowerCase().includes("beard") ||
                s.name.toLowerCase().includes("shave")
            );

            return (
              <div
                key={salon.id}
                className="luxury-card rounded-2xl overflow-hidden flex flex-col group border border-white/[0.08] hover:border-gold/40 transition-all duration-300"
              >
                {/* Salon Image - Clickable to Detail */}
                <Link href={`/salons/${salon.id}`} className="relative h-56 w-full overflow-hidden block">
                  <Image
                    src={salon.bannerImage}
                    alt={salon.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121217] via-transparent to-black/30" />

                  {/* Rating pill */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-xl bg-[#08080B]/85 backdrop-blur-md border border-white/[0.1] flex items-center space-x-1 text-xs">
                    <Star className="w-3.5 h-3.5 text-gold fill-gold" />
                    <span className="font-bold text-white">{salon.rating}</span>
                    <span className="text-[#71717A]">({salon.reviewCount})</span>
                  </div>

                  {/* Live Queue Badge */}
                  <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-[#08080B]/90 backdrop-blur-md border border-gold/30 flex items-center space-x-1.5 text-xs text-gold">
                    <Clock className="w-3.5 h-3.5 text-gold" />
                    <span className="font-semibold">
                      Serving #{salon.currentServingToken} • {salon.activeQueueCount} Waiting
                    </span>
                  </div>
                </Link>

                {/* Salon Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <Link href={`/salons/${salon.id}`} className="block group-hover:text-gold transition-colors">
                      <h3 className="text-lg font-bold text-white group-hover:text-gold transition-colors">
                        {salon.name}
                      </h3>
                    </Link>
                    <p className="text-xs text-[#A1A1AA] flex items-center mt-1">
                      <MapPin className="w-3.5 h-3.5 text-gold mr-1.5 shrink-0" />
                      {salon.address}
                    </p>
                    <p className="text-xs text-[#71717A] mt-2 line-clamp-2">
                      {salon.tagline}
                    </p>
                  </div>

                  {/* Rate Card Quick Highlights: Haircut & Beard */}
                  <div className="flex items-center space-x-2 text-xs bg-[#08080B] p-2.5 rounded-xl border border-white/[0.06]">
                    {haircutService && (
                      <div className="flex items-center space-x-1">
                        <span className="text-[10px] text-[#71717A] uppercase font-semibold">Haircut:</span>
                        <span className="text-white font-bold">₹{haircutService.price}</span>
                      </div>
                    )}
                    {haircutService && beardService && (
                      <span className="text-[#71717A]">•</span>
                    )}
                    {beardService && (
                      <div className="flex items-center space-x-1">
                        <span className="text-[10px] text-[#71717A] uppercase font-semibold">Beard:</span>
                        <span className="text-white font-bold">₹{beardService.price}</span>
                      </div>
                    )}
                  </div>

                  {/* Available Services Chips */}
                  <div className="flex flex-wrap gap-1.5">
                    {salon.services.slice(0, 3).map((srv) => (
                      <span
                        key={srv.id}
                        className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#08080B] text-[#A1A1AA] border border-white/[0.06]"
                      >
                        {srv.name}
                      </span>
                    ))}
                    {salon.services.length > 3 && (
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#08080B] text-gold border border-gold/20">
                        +{salon.services.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Pricing and Action */}
                  <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-[#71717A] uppercase font-semibold">Starting from</p>
                      <p className="text-base font-extrabold text-gold">₹{salon.startingPrice}</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/salons/${salon.id}`}
                        className="px-3.5 py-2 text-xs font-semibold text-white hover:text-gold rounded-xl border border-white/[0.1] hover:border-gold/40 transition-colors bg-[#08080B]"
                      >
                        All Details →
                      </Link>
                      <Link
                        href={`/book?salonId=${salon.id}`}
                        className="gold-btn px-4 py-2 text-xs rounded-xl uppercase tracking-wider font-bold"
                      >
                        Book
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. CLEAN & SPACIOUS LIVE QUEUE SHOWCASE */}
      <section className="py-20 bg-[#0C0C10] border-y border-white/[0.08]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-5">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-semibold">
                <Clock className="w-3.5 h-3.5 text-gold" />
                <span>Live Queue Technology</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Zero Lobby Waiting. <br />
                <span className="text-gold-gradient">Track On Your Phone.</span>
              </h2>

              <p className="text-[#A1A1AA] leading-relaxed text-sm">
                Join the live salon queue from home or on the go. Watch your token progress in real time and arrive just as your barber chair opens up.
              </p>

              <div className="pt-2">
                <Link
                  href="/queue"
                  className="gold-btn inline-flex items-center px-6 py-3 rounded-xl text-xs uppercase tracking-wider font-bold shadow-gold"
                >
                  <span>Track Live Queue</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>

            {/* Live Queue Card - Clean & Balanced */}
            <div className="bg-[#121217]/95 border border-white/[0.1] rounded-3xl p-6 sm:p-7 shadow-2xl backdrop-blur-2xl space-y-5">
              <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.08]">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gold" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-gold">
                    Live Queue Active
                  </span>
                </div>
                <span className="text-xs text-[#71717A]">The Royal Crown Barbershop</span>
              </div>

              {/* Tokens Comparison */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#08080B] p-4 rounded-2xl border border-white/[0.08] text-center">
                  <p className="text-[10px] uppercase tracking-wider text-[#71717A] font-medium">
                    Now Serving
                  </p>
                  <p className="text-3xl font-black text-white mt-1">#09</p>
                  <span className="inline-block mt-1.5 text-[10px] px-2 py-0.5 rounded-full bg-gold/10 text-gold border border-gold/30 font-medium">
                    In Chair
                  </span>
                </div>

                <div className="bg-[#08080B] p-4 rounded-2xl border border-gold/50 text-center relative overflow-hidden shadow-gold">
                  <p className="text-[10px] uppercase tracking-wider text-gold font-medium">
                    Your Token
                  </p>
                  <p className="text-3xl font-black text-gold mt-1">#12</p>
                  <span className="inline-block mt-1.5 text-[10px] px-2.5 py-0.5 rounded-full bg-gold/15 text-gold border border-gold/30 font-medium">
                    Confirmed
                  </span>
                </div>
              </div>

              {/* Queue Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-[#71717A]">Queue Position</span>
                  <span className="text-gold font-semibold">3 Clients Ahead</span>
                </div>
                <div className="w-full h-2 bg-[#08080B] rounded-full overflow-hidden border border-white/[0.08]">
                  <div
                    className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F5DE88] rounded-full shadow-[0_0_10px_#D4AF37]"
                    style={{ width: "70%" }}
                  />
                </div>
              </div>

              {/* Estimated Wait Stats Box */}
              <div className="bg-[#08080B] rounded-xl p-3.5 border border-white/[0.08] flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-[#71717A]">Estimated Wait Time</p>
                  <p className="text-lg font-bold text-white mt-0.5">~ 25 Minutes</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-[#71717A]">Active Barbers</p>
                  <p className="text-xs font-semibold text-gold">3 Master Barbers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section id="how-it-works" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center space-x-1.5 text-xs text-gold font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Effortless Grooming Journey</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How SalonX Works
          </h2>
          <p className="text-xs text-[#71717A]">
            Experience luxury grooming without wasting hours in salon lobbies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="luxury-card p-8 rounded-2xl relative group border border-white/[0.08]">
            <span className="text-4xl font-black text-[#262630] group-hover:text-gold/40 transition-colors">
              01
            </span>
            <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center my-4">
              <Search className="w-6 h-6 text-gold" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Discover & Choose</h3>
            <p className="text-xs text-[#71717A] leading-relaxed">
              Explore verified luxury salons, view authentic ratings, master barber portfolios, and select from bespoke menus.
            </p>
          </div>

          {/* Step 2 */}
          <div className="luxury-card p-8 rounded-2xl relative group border border-white/[0.08]">
            <span className="text-4xl font-black text-[#262630] group-hover:text-gold/40 transition-colors">
              02
            </span>
            <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center my-4">
              <Calendar className="w-6 h-6 text-gold" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Book Slot or Walk-in Queue</h3>
            <p className="text-xs text-[#71717A] leading-relaxed">
              Choose an appointment time slot or join the live walk-in queue from anywhere. Receive your unique token number immediately.
            </p>
          </div>

          {/* Step 3 */}
          <div className="luxury-card p-8 rounded-2xl relative group border border-white/[0.08]">
            <span className="text-4xl font-black text-[#262630] group-hover:text-gold/40 transition-colors">
              03
            </span>
            <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center my-4">
              <Clock className="w-6 h-6 text-gold" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Track Live & Arrive on Time</h3>
            <p className="text-xs text-[#71717A] leading-relaxed">
              Watch real-time tokens progress on your phone. Arrive comfortably just as your chair is prepared. Enjoy zero waiting.
            </p>
          </div>
        </div>
      </section>

      {/* 5. PARTNER BANNER */}
      <section className="pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="relative rounded-3xl overflow-hidden border border-gold/30 bg-gradient-to-r from-[#121217] via-[#1A1A24] to-[#121217] p-8 sm:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="relative max-w-2xl space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-gold">
              For Salon Owners & Master Barbers
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Grow Your Salon with SalonX Live Queue Technology
            </h2>
            <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed">
              Eliminate lobby overcrowding, delight high-paying clientele, optimize barber utilization, and boost re-bookings by 35%.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                href="/become-partner"
                className="gold-btn px-6 py-3 rounded-xl text-xs uppercase tracking-wider shadow-gold"
              >
                Register Your Salon
              </Link>
              <Link
                href="/owner"
                className="luxury-btn-secondary px-6 py-3 rounded-xl font-semibold text-xs uppercase tracking-wider"
              >
                Owner Demo Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
