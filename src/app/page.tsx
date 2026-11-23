"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Search,
  MapPin,
  Calendar,
  Clock,
  Star,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Flame,
  ArrowRight,
  Scissors,
  CheckCircle2,
  Users,
  Compass,
  Layers,
} from "lucide-react";
import { useSalonStore } from "@/lib/store/salonStore";

export default function HomePage() {
  const router = useRouter();
  const { salons, bookings } = useSalonStore();

  // Search state
  const [cityFilter, setCityFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedServiceCategory, setSelectedServiceCategory] = useState("All");

  const activeSalons = salons.filter((s) => s.status === "active");

  const cities = ["All", "Mumbai", "Bengaluru", "New Delhi", "Pune"];
  const serviceCategories = [
    { name: "Haircut", label: "Precision Haircut", icon: Scissors },
    { name: "Beard Trimming", label: "Straight Razor Shave", icon: Sparkles },
    { name: "Spa", label: "Japanese Head Spa", icon: Compass },
    { name: "Facial", label: "Detox Facial", icon: Layers },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (cityFilter !== "All") params.set("city", cityFilter);
    if (searchQuery) params.set("q", searchQuery);
    if (selectedServiceCategory !== "All") params.set("category", selectedServiceCategory);
    router.push(`/salons?${params.toString()}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0B0B0D]">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden pt-12 pb-24">
        {/* Background Image with Cinematic Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2000&auto=format&fit=crop"
            alt="Luxury Barbershop Atelier"
            fill
            priority
            className="object-cover object-center scale-105 opacity-30"
          />
          {/* Subtle Vignettes */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0D] via-[#0B0B0D]/75 to-[#0B0B0D]/90"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0D] via-transparent to-[#0B0B0D]"></div>
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[650px] h-[360px] bg-gold/10 blur-[140px] rounded-full pointer-events-none"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-7">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#141418] border border-white/[0.08] shadow-luxury">
            <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-gold">
              Bespoke Grooming & Live Queue
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
            Your Style. Your Time. <br />
            <span className="text-gold-gradient">Zero Waiting.</span>
          </h1>

          {/* Subheading */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#A1A1AA] leading-relaxed">
            Discover verified luxury salons, book bespoke chair appointments, and track your live queue in real time.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/salons"
              className="gold-btn w-full sm:w-auto px-8 py-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center group shadow-gold"
            >
              <span>Explore Salons</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/book"
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-[#141418] border border-white/[0.1] hover:border-gold/50 hover:bg-[#1A1A20] transition-all flex items-center justify-center"
            >
              <Clock className="w-4 h-4 mr-2 text-gold" />
              <span>Book Appointment</span>
            </Link>
          </div>

          {/* Highlights Mini Bar */}
          <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto border-t border-white/[0.06] text-left">
            <div className="p-3">
              <p className="text-2xl font-bold text-white">100%</p>
              <p className="text-xs text-[#71717A] mt-0.5">Live Queue Sync</p>
            </div>
            <div className="p-3">
              <p className="text-2xl font-bold text-gold flex items-center">
                4.9
                <Star className="w-4 h-4 text-gold fill-gold ml-1 inline" />
              </p>
              <p className="text-xs text-[#71717A] mt-0.5">Master Barber Rating</p>
            </div>
            <div className="p-3">
              <p className="text-2xl font-bold text-white">0 min</p>
              <p className="text-xs text-[#71717A] mt-0.5">Lobby Waiting Time</p>
            </div>
            <div className="p-3">
              <p className="text-2xl font-bold text-gold">25+</p>
              <p className="text-xs text-[#71717A] mt-0.5">Curated Ateliers</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SEARCH & FILTER DOCK */}
      <section className="relative z-20 -mt-12 max-w-6xl mx-auto px-4 sm:px-6 w-full">
        <div className="bg-[#141418] border border-white/[0.08] rounded-2xl p-4 sm:p-6 shadow-2xl backdrop-blur-xl">
          <form onSubmit={handleSearchSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* City selector */}
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider font-semibold text-[#71717A] flex items-center">
                  <MapPin className="w-3.5 h-3.5 text-gold mr-1" />
                  City / Location
                </label>
                <select
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  className="w-full bg-[#0B0B0D] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-gold transition-colors"
                >
                  {cities.map((c) => (
                    <option key={c} value={c}>
                      {c === "All" ? "All Metro Cities" : c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Service Desired */}
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider font-semibold text-[#71717A] flex items-center">
                  <Scissors className="w-3.5 h-3.5 text-gold mr-1" />
                  Service Desired
                </label>
                <select
                  value={selectedServiceCategory}
                  onChange={(e) => setSelectedServiceCategory(e.target.value)}
                  className="w-full bg-[#0B0B0D] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-gold transition-colors"
                >
                  <option value="All">All Master Services</option>
                  <option value="Haircut">Precision Haircut</option>
                  <option value="Beard Trimming">Beard Sculpt & Shave</option>
                  <option value="Spa">Japanese Head Spa</option>
                  <option value="Facial">Charcoal Detox Facial</option>
                  <option value="Hair Coloring">Hair Coloring & Balayage</option>
                </select>
              </div>

              {/* Keyword Search */}
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider font-semibold text-[#71717A] flex items-center">
                  <Search className="w-3.5 h-3.5 text-gold mr-1" />
                  Salon Name or Area
                </label>
                <input
                  type="text"
                  placeholder="e.g. Royal Crown, Bandra..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#0B0B0D] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#71717A] focus:outline-none focus:border-gold transition-colors"
                />
              </div>

              {/* Action Button */}
              <div className="flex items-end">
                <button
                  type="submit"
                  className="gold-btn w-full py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center space-x-2 h-[40px] shadow-gold"
                >
                  <Search className="w-4 h-4 text-black" />
                  <span>Search Salons</span>
                </button>
              </div>
            </div>
          </form>

          {/* Service Category Pills */}
          <div className="pt-4 mt-4 border-t border-white/[0.06] flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-[11px] text-[#71717A] uppercase font-semibold shrink-0 mr-1">
              Popular:
            </span>
            {serviceCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.name}
                  onClick={() => router.push(`/salons?category=${encodeURIComponent(cat.name)}`)}
                  className="px-3 py-1.5 rounded-lg bg-[#0B0B0D] border border-white/[0.08] hover:border-gold/40 text-xs text-[#A1A1AA] hover:text-white transition-all flex items-center space-x-1.5 shrink-0"
                >
                  <Icon className="w-3.5 h-3.5 text-gold" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. LIVE QUEUE TECHNOLOGY SHOWCASE */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-semibold">
              <Clock className="w-3.5 h-3.5 text-gold" />
              <span>Real-Time Floor Tracking</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Real-Time Queue Management. <br />
              <span className="text-gold">Zero Waiting.</span>
            </h2>
            <p className="text-[#A1A1AA] leading-relaxed text-sm sm:text-base">
              Track your exact chair time using active barber throughput, requested service duration, and real-time updates from the salon floor.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-gold/15 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-gold" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Dynamic Duration Calculation</h4>
                  <p className="text-xs text-[#71717A]">
                    Each haircut, facial, and shave duration is calculated automatically.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-gold/15 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-gold" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Turnaround Alerts</h4>
                  <p className="text-xs text-[#71717A]">
                    Arrive right when your token is called.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-gold/15 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-gold" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Concurrency-Safe Tokens</h4>
                  <p className="text-xs text-[#71717A]">
                    Guaranteed unique tokens with zero overlapping bookings.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/queue"
                className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-gold hover:text-white transition-colors"
              >
                <span>Track Your Live Token Now</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>

          {/* Interactive Live Queue Simulator Card */}
          <div className="relative">
            <div className="relative bg-[#141418] border border-white/[0.1] rounded-3xl p-6 sm:p-8 shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-green-400">
                    Live Queue Active
                  </span>
                </div>
                <span className="text-xs text-[#71717A]">The Royal Crown Barbershop</span>
              </div>

              {/* Tokens Comparison Grid */}
              <div className="grid grid-cols-2 gap-4 my-6">
                <div className="bg-[#0B0B0D] p-5 rounded-2xl border border-white/[0.06] text-center">
                  <p className="text-[10px] uppercase tracking-wider text-[#71717A] font-medium">
                    Now Serving
                  </p>
                  <p className="text-4xl font-extrabold text-white mt-1">#09</p>
                  <span className="inline-block mt-2 text-[10px] px-2.5 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 font-medium">
                    In Chair (Marcus V.)
                  </span>
                </div>

                <div className="bg-[#0B0B0D] p-5 rounded-2xl border border-gold/40 text-center relative overflow-hidden shadow-gold">
                  <p className="text-[10px] uppercase tracking-wider text-gold font-medium">
                    Your Token
                  </p>
                  <p className="text-4xl font-extrabold text-gold mt-1">#12</p>
                  <span className="inline-block mt-2 text-[10px] px-2.5 py-0.5 rounded-full bg-gold/15 text-gold border border-gold/30 font-medium">
                    Confirmed
                  </span>
                </div>
              </div>

              {/* Queue Progress Bar */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-xs">
                  <span className="text-[#71717A]">Queue Position</span>
                  <span className="text-gold font-semibold">3 Clients Ahead</span>
                </div>
                <div className="w-full h-2.5 bg-[#0B0B0D] rounded-full overflow-hidden border border-white/[0.06]">
                  <div
                    className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F5DE88] rounded-full"
                    style={{ width: "70%" }}
                  ></div>
                </div>
              </div>

              {/* Estimated Wait Stats Box */}
              <div className="bg-[#0B0B0D] rounded-xl p-4 border border-white/[0.06] flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-[#71717A]">Estimated Wait Time</p>
                  <p className="text-xl font-bold text-white mt-0.5">~ 25 Minutes</p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] text-[#71717A]">Floor Barbers Active</p>
                  <p className="text-sm font-semibold text-gold">3 Master Barbers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED LUXURY SALONS */}
      <section className="py-20 bg-[#0E0E12] border-y border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
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
            {activeSalons.slice(0, 3).map((salon) => (
              <div
                key={salon.id}
                className="luxury-card rounded-2xl overflow-hidden flex flex-col group"
              >
                {/* Salon Image */}
                <div className="relative h-56 w-full overflow-hidden">
                  <Image
                    src={salon.bannerImage}
                    alt={salon.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121215] via-transparent to-black/30"></div>

                  {/* Rating pill */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-[#0B0B0D]/85 backdrop-blur-md border border-white/[0.1] flex items-center space-x-1 text-xs">
                    <Star className="w-3.5 h-3.5 text-gold fill-gold" />
                    <span className="font-bold text-white">{salon.rating}</span>
                    <span className="text-[#71717A]">({salon.reviewCount})</span>
                  </div>

                  {/* Live Queue Badge */}
                  <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-[#0B0B0D]/90 backdrop-blur-md border border-white/[0.08] flex items-center space-x-1.5 text-xs text-green-400">
                    <span className="font-medium">
                      Serving #{salon.currentServingToken} • {salon.activeQueueCount} Waiting
                    </span>
                  </div>
                </div>

                {/* Salon Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-gold transition-colors">
                      {salon.name}
                    </h3>
                    <p className="text-xs text-[#A1A1AA] flex items-center mt-1">
                      <MapPin className="w-3 h-3 text-gold mr-1 shrink-0" />
                      {salon.address}
                    </p>
                    <p className="text-xs text-[#71717A] mt-2 line-clamp-2">
                      {salon.tagline}
                    </p>
                  </div>

                  {/* Available Services Chips */}
                  <div className="flex flex-wrap gap-1.5">
                    {salon.services.slice(0, 3).map((srv) => (
                      <span
                        key={srv.id}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-[#0B0B0D] text-[#A1A1AA] border border-white/[0.06]"
                      >
                        {srv.name}
                      </span>
                    ))}
                    {salon.services.length > 3 && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#0B0B0D] text-gold border border-gold/20">
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
                        className="px-3 py-2 text-xs font-semibold text-[#A1A1AA] hover:text-white rounded-lg border border-white/[0.08] hover:border-gold/40 transition-colors"
                      >
                        Details
                      </Link>
                      <Link
                        href={`/book?salonId=${salon.id}`}
                        className="gold-btn px-4 py-2 text-xs rounded-lg uppercase tracking-wider"
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS */}
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
          <div className="luxury-card p-8 rounded-2xl relative group">
            <span className="text-4xl font-black text-[#26262C] group-hover:text-gold/30 transition-colors">
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
          <div className="luxury-card p-8 rounded-2xl relative group">
            <span className="text-4xl font-black text-[#26262C] group-hover:text-gold/30 transition-colors">
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
          <div className="luxury-card p-8 rounded-2xl relative group">
            <span className="text-4xl font-black text-[#26262C] group-hover:text-gold/30 transition-colors">
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

      {/* 6. PARTNER BANNER */}
      <section className="pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="relative rounded-3xl overflow-hidden border border-white/[0.08] bg-gradient-to-r from-[#141418] via-[#1A1A22] to-[#141418] p-8 sm:p-12 shadow-2xl">
          <div className="max-w-2xl space-y-4">
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
                className="gold-btn px-6 py-3 rounded-xl text-xs uppercase tracking-wider"
              >
                Register Your Salon
              </Link>
              <Link
                href="/owner"
                className="px-6 py-3 rounded-xl bg-[#0B0B0D] text-white border border-white/[0.1] font-semibold text-xs uppercase tracking-wider hover:border-gold transition-colors"
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
