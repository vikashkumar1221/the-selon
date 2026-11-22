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
  SlidersHorizontal,
  Flame,
  ArrowRight,
  Scissors,
  CheckCircle2,
  Users,
  Smartphone,
} from "lucide-react";
import { useSalonStore } from "@/lib/store/salonStore";

export default function HomePage() {
  const router = useRouter();
  const { salons, bookings } = useSalonStore();

  // Search state
  const [cityFilter, setCityFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedServiceCategory, setSelectedServiceCategory] = useState("All");
  const [minRating, setMinRating] = useState(0);

  const activeSalons = salons.filter((s) => s.status === "active");

  const cities = ["All", "Mumbai", "Bengaluru", "New Delhi", "Pune"];
  const serviceCategories = [
    "All",
    "Haircut",
    "Beard Trimming",
    "Hair Styling",
    "Facial",
    "Spa",
    "Hair Coloring",
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
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-12 pb-20">
        {/* Background Image with Dark Vignette & Gold Atmospheric Glow */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2000&auto=format&fit=crop"
            alt="Luxury Barbershop & Salon Sanctuary"
            fill
            priority
            className="object-cover object-center scale-105 opacity-35"
          />
          {/* Gradients to blend into deep black */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0D] via-[#0B0B0D]/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0D] via-transparent to-[#0B0B0D]"></div>
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gold/10 blur-[130px] rounded-full pointer-events-none"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#171719]/90 border border-gold-border/40 backdrop-blur-md shadow-gold">
            <span className="w-2 h-2 rounded-full bg-gold animate-ping"></span>
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-white">
              Next-Gen Multi-Salon Architecture
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Your Style. Your Time. <br />
            <span className="text-gold-gradient">Zero Waiting.</span>
          </h1>

          {/* Subheading */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#A1A1AA] leading-relaxed">
            Discover premium salons, book your appointment, and track your live queue — all in one place.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/salons"
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-semibold uppercase tracking-wider text-black bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#BFA15F] shadow-gold hover:opacity-95 transition-all transform hover:-translate-y-0.5 flex items-center justify-center group"
            >
              <span>Explore Salons</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/book"
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-semibold uppercase tracking-wider text-white bg-[#171719] border border-gold-border/40 hover:bg-[#212124] hover:border-gold transition-all flex items-center justify-center"
            >
              <Clock className="w-4 h-4 mr-2 text-gold" />
              <span>Book Appointment</span>
            </Link>
          </div>

          {/* Highlights Mini Bar */}
          <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto border-t border-charcoal-border/50 text-left">
            <div className="p-3">
              <p className="text-2xl font-bold text-white">100%</p>
              <p className="text-xs text-[#A1A1AA]">Live Queue Sync</p>
            </div>
            <div className="p-3">
              <p className="text-2xl font-bold text-gold">4.9★</p>
              <p className="text-xs text-[#A1A1AA]">Top Barber Rating</p>
            </div>
            <div className="p-3">
              <p className="text-2xl font-bold text-white">0 min</p>
              <p className="text-xs text-[#A1A1AA]">Physical Wait Time</p>
            </div>
            <div className="p-3">
              <p className="text-2xl font-bold text-gold">25+</p>
              <p className="text-xs text-[#A1A1AA]">Luxury Locations</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SEARCH & FILTER INTERACTIVE DOCK */}
      <section className="relative z-20 -mt-10 max-w-6xl mx-auto px-4 sm:px-6 w-full">
        <div className="bg-[#171719]/90 border border-gold-border/30 rounded-2xl p-4 sm:p-6 shadow-luxury backdrop-blur-xl">
          <form onSubmit={handleSearchSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* City selector */}
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider font-semibold text-[#A1A1AA] flex items-center">
                  <MapPin className="w-3.5 h-3.5 text-gold mr-1" />
                  City / Location
                </label>
                <select
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  className="w-full bg-[#0B0B0D] border border-charcoal-border rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-gold transition-colors"
                >
                  {cities.map((c) => (
                    <option key={c} value={c}>
                      {c === "All" ? "All Metro Cities" : c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Service Category */}
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider font-semibold text-[#A1A1AA] flex items-center">
                  <Scissors className="w-3.5 h-3.5 text-gold mr-1" />
                  Service Desired
                </label>
                <select
                  value={selectedServiceCategory}
                  onChange={(e) => setSelectedServiceCategory(e.target.value)}
                  className="w-full bg-[#0B0B0D] border border-charcoal-border rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-gold transition-colors"
                >
                  {serviceCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === "All" ? "All Master Services" : cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Keyword / Salon name */}
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider font-semibold text-[#A1A1AA] flex items-center">
                  <Search className="w-3.5 h-3.5 text-gold mr-1" />
                  Salon Name or Area
                </label>
                <input
                  type="text"
                  placeholder="e.g. Royal Crown, Bandra..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#0B0B0D] border border-charcoal-border rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-[#71717A] focus:outline-none focus:border-gold transition-colors"
                />
              </div>

              {/* Action Button */}
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-gold text-black font-semibold text-sm uppercase tracking-wider hover:bg-gold-light transition-colors flex items-center justify-center space-x-2 h-[42px]"
                >
                  <Search className="w-4 h-4 text-black" />
                  <span>Search Salons</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* 3. LIVE QUEUE TECHNOLOGY SHOWCASE (THE CORE VALUE PROP) */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-semibold">
              <Clock className="w-3.5 h-3.5 animate-spin" />
              <span>Proprietary Algorithm</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Real-Time Queue Management. <br />
              <span className="text-gold">No More Waiting in Chairs.</span>
            </h2>
            <p className="text-[#A1A1AA] leading-relaxed text-sm sm:text-base">
              Traditional salons force you to wait in stuffy lobbies. SalonX dynamically predicts your exact chair time using active barber throughput, requested service duration, and real-time status updates from the barber’s tablet.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-gold" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Dynamic Duration Factoring</h4>
                  <p className="text-xs text-[#A1A1AA]">
                    Each haircut, facial, and shave has unique time weights calculated automatically.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-gold" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Live Turnaround Alerts</h4>
                  <p className="text-xs text-[#A1A1AA]">
                    Arrive just in time when your token is 1 customer away.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-gold" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Concurrency Safe Token Generation</h4>
                  <p className="text-xs text-[#A1A1AA]">
                    Zero duplicate tokens or double bookings in the same chair queue.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/queue"
                className="inline-flex items-center text-sm font-semibold text-gold hover:text-white transition-colors"
              >
                <span>Track Your Live Token Now</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>

          {/* Interactive Live Queue Simulator Card */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-gold/30 to-gold-dark/20 rounded-3xl blur-xl opacity-60"></div>
            <div className="relative bg-[#171719] border border-gold-border/50 rounded-2xl p-6 sm:p-8 shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-charcoal-border">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-green-400">
                    Live Broadcast Active
                  </span>
                </div>
                <span className="text-xs text-[#A1A1AA]">The Royal Crown Barbershop</span>
              </div>

              {/* Tokens Comparison Grid */}
              <div className="grid grid-cols-2 gap-4 my-6">
                <div className="bg-[#0B0B0D] p-5 rounded-xl border border-charcoal-border text-center">
                  <p className="text-[11px] uppercase tracking-wider text-[#A1A1AA] font-medium">
                    Now Serving
                  </p>
                  <p className="text-4xl font-extrabold text-white mt-1">#09</p>
                  <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                    In Chair (Marcus V.)
                  </span>
                </div>

                <div className="bg-[#0B0B0D] p-5 rounded-xl border border-gold/40 text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-8 h-8 bg-gold/10 rounded-bl-xl flex items-center justify-center">
                    <Star className="w-3.5 h-3.5 text-gold" />
                  </div>
                  <p className="text-[11px] uppercase tracking-wider text-gold font-medium">
                    Your Token
                  </p>
                  <p className="text-4xl font-extrabold text-gold mt-1">#12</p>
                  <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full bg-gold/15 text-gold border border-gold/30">
                    Confirmed
                  </span>
                </div>
              </div>

              {/* Queue Progress Bar */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-xs">
                  <span className="text-[#A1A1AA]">Queue Progress (Ahead of you)</span>
                  <span className="text-gold font-semibold">3 Customers Ahead</span>
                </div>
                <div className="w-full h-2.5 bg-[#0B0B0D] rounded-full overflow-hidden border border-charcoal-border">
                  <div
                    className="h-full bg-gradient-to-r from-gold to-gold-light rounded-full transition-all duration-500"
                    style={{ width: "70%" }}
                  ></div>
                </div>
              </div>

              {/* Estimated Wait Stats Box */}
              <div className="bg-[#0B0B0D]/80 rounded-xl p-4 border border-charcoal-border flex items-center justify-between">
                <div>
                  <p className="text-xs text-[#A1A1AA]">Dynamic Estimated Wait</p>
                  <p className="text-xl font-bold text-white mt-0.5">~ 25 Minutes</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[#A1A1AA]">Floor Barbers Active</p>
                  <p className="text-sm font-semibold text-gold">3 Master Barbers</p>
                </div>
              </div>

              {/* Dynamic disclaimer */}
              <p className="text-[11px] text-[#71717A] text-center mt-4 italic">
                * Note: Waiting times are continuously recalculated using live service progress and may fluctuate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED LUXURY SALONS */}
      <section className="py-20 bg-[#0E0E10] border-y border-charcoal-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="inline-flex items-center space-x-1.5 text-xs text-gold font-semibold uppercase tracking-wider mb-2">
                <Flame className="w-4 h-4 text-gold" />
                <span>Hand-Selected Sanctuaries</span>
              </div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                Featured Luxury Salons
              </h2>
              <p className="text-sm text-[#A1A1AA] mt-1">
                Verified high-end barber shops and couture hair ateliers.
              </p>
            </div>
            <Link
              href="/salons"
              className="inline-flex items-center text-sm font-semibold text-gold hover:text-white transition-colors mt-4 md:mt-0"
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
                className="bg-[#171719] rounded-2xl border border-charcoal-border overflow-hidden hover:border-gold/40 transition-all duration-300 hover:shadow-gold flex flex-col group"
              >
                {/* Salon Image */}
                <div className="relative h-56 w-full overflow-hidden">
                  <Image
                    src={salon.bannerImage}
                    alt={salon.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#171719] via-transparent to-black/30"></div>

                  {/* Rating pill */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-[#0B0B0D]/80 backdrop-blur-md border border-gold-border/30 flex items-center space-x-1 text-xs">
                    <Star className="w-3.5 h-3.5 text-gold fill-gold" />
                    <span className="font-bold text-white">{salon.rating}</span>
                    <span className="text-[#A1A1AA]">({salon.reviewCount})</span>
                  </div>

                  {/* Live Queue Badge */}
                  <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-[#0B0B0D]/90 backdrop-blur-md border border-green-500/40 flex items-center space-x-1.5 text-xs text-green-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
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
                        className="text-[10px] px-2 py-0.5 rounded-full bg-[#0B0B0D] text-[#A1A1AA] border border-charcoal-border"
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
                  <div className="pt-3 border-t border-charcoal-border/50 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-[#A1A1AA] uppercase font-semibold">Starting from</p>
                      <p className="text-base font-extrabold text-gold">₹{salon.startingPrice}</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/salons/${salon.id}`}
                        className="px-3 py-2 text-xs font-semibold text-[#A1A1AA] hover:text-white rounded-lg border border-charcoal-border hover:border-gold/40 transition-colors"
                      >
                        Details
                      </Link>
                      <Link
                        href={`/book?salonId=${salon.id}`}
                        className="px-4 py-2 text-xs font-semibold text-black bg-gold hover:bg-gold-light rounded-lg transition-colors uppercase tracking-wider"
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
          <p className="text-sm text-[#A1A1AA]">
            Experience luxury grooming without wasting hours in salon lobbies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-[#171719] p-8 rounded-2xl border border-charcoal-border relative group hover:border-gold/40 transition-all">
            <span className="text-5xl font-black text-charcoal-border group-hover:text-gold/20 transition-colors">
              01
            </span>
            <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center my-4">
              <Search className="w-6 h-6 text-gold" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Discover & Choose</h3>
            <p className="text-xs text-[#A1A1AA] leading-relaxed">
              Explore verified luxury salons, view authentic ratings, master barber portfolios, and select from bespoke menus.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-[#171719] p-8 rounded-2xl border border-charcoal-border relative group hover:border-gold/40 transition-all">
            <span className="text-5xl font-black text-charcoal-border group-hover:text-gold/20 transition-colors">
              02
            </span>
            <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center my-4">
              <Calendar className="w-6 h-6 text-gold" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Book Slot or Walk-in Queue</h3>
            <p className="text-xs text-[#A1A1AA] leading-relaxed">
              Choose an appointment time slot or join the live walk-in queue from anywhere. Receive your unique token number immediately.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-[#171719] p-8 rounded-2xl border border-charcoal-border relative group hover:border-gold/40 transition-all">
            <span className="text-5xl font-black text-charcoal-border group-hover:text-gold/20 transition-colors">
              03
            </span>
            <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center my-4">
              <Clock className="w-6 h-6 text-gold" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Track Live & Arrive on Time</h3>
            <p className="text-xs text-[#A1A1AA] leading-relaxed">
              Watch real-time tokens progress on your phone. Arrive comfortably just as your chair is prepared. Enjoy zero waiting.
            </p>
          </div>
        </div>
      </section>

      {/* 6. PARTNER WITH SALONX BANNER */}
      <section className="pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="relative rounded-3xl overflow-hidden border border-gold-border/40 bg-gradient-to-r from-[#171719] via-[#1E1E24] to-[#171719] p-8 sm:p-12 shadow-gold">
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
                className="px-6 py-3 rounded-xl bg-gold text-black font-semibold text-xs uppercase tracking-wider hover:bg-gold-light transition-colors"
              >
                Register Your Salon
              </Link>
              <Link
                href="/owner"
                className="px-6 py-3 rounded-xl bg-[#0B0B0D] text-white border border-charcoal-border font-semibold text-xs uppercase tracking-wider hover:border-gold transition-colors"
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
