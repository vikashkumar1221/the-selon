"use client";

import { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  Search,
  MapPin,
  Star,
  Clock,
  Filter,
  SlidersHorizontal,
  Scissors,
  Check,
  ChevronRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useSalonStore } from "@/lib/store/salonStore";

function SalonsContent() {
  const searchParams = useSearchParams();
  const initialCity = searchParams.get("city") || "All";
  const initialCategory = searchParams.get("category") || "All";
  const initialQuery = searchParams.get("q") || "";

  const { salons } = useSalonStore();

  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [minRating, setMinRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [sortBy, setSortBy] = useState<"rating" | "price" | "wait">("rating");

  const cities = ["All", "Mumbai", "Bengaluru", "New Delhi", "Pune"];
  const categories = [
    "All",
    "Haircut",
    "Beard Trimming",
    "Hair Styling",
    "Facial",
    "Spa",
    "Hair Coloring",
  ];

  // Filtering logic
  const filteredSalons = useMemo(() => {
    return salons
      .filter((s) => s.status === "active")
      .filter((s) => {
        if (selectedCity !== "All" && s.city !== selectedCity) return false;
        if (searchQuery.trim() !== "") {
          const q = searchQuery.toLowerCase();
          const matchName = s.name.toLowerCase().includes(q);
          const matchArea = s.area.toLowerCase().includes(q);
          const matchCity = s.city.toLowerCase().includes(q);
          const matchService = s.services.some((srv) =>
            srv.name.toLowerCase().includes(q)
          );
          if (!matchName && !matchArea && !matchCity && !matchService) return false;
        }
        if (selectedCategory !== "All") {
          const hasCat = s.services.some(
            (srv) => srv.category.toLowerCase() === selectedCategory.toLowerCase()
          );
          if (!hasCat) return false;
        }
        if (minRating > 0 && s.rating < minRating) return false;
        if (s.startingPrice > maxPrice) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "rating") return b.rating - a.rating;
        if (sortBy === "price") return a.startingPrice - b.startingPrice;
        if (sortBy === "wait") return a.activeQueueCount - b.activeQueueCount;
        return 0;
      });
  }, [
    salons,
    selectedCity,
    selectedCategory,
    searchQuery,
    minRating,
    maxPrice,
    sortBy,
  ]);

  return (
    <div className="min-h-screen bg-[#08080B] py-10 pb-28 text-[#F4F4F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumbs */}
        <div className="flex items-center space-x-2 text-xs text-[#71717A] mb-4">
          <Link href="/" className="hover:text-gold transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-white font-medium">Explore Salons</span>
        </div>

        {/* Title Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 border-b border-white/[0.08] gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Bespoke Salons & Ateliers
            </h1>
            <p className="text-xs text-[#71717A] mt-1">
              Showing {filteredSalons.length} verified luxury salons with live queue integration
            </p>
          </div>

          {/* Quick Sorting dropdown */}
          <div className="flex items-center space-x-3">
            <span className="text-xs text-[#71717A]">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#121217] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold transition-colors"
            >
              <option value="rating">Highest Rating</option>
              <option value="price">Price: Low to High</option>
              <option value="wait">Shortest Queue</option>
            </select>
          </div>
        </div>

        {/* Quick City Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto py-4 border-b border-white/[0.06]">
          <span className="text-[11px] uppercase font-semibold text-[#71717A] shrink-0 mr-1 tracking-wider">
            Cities:
          </span>
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`text-xs px-3.5 py-1.5 rounded-xl border transition-all shrink-0 font-medium ${
                selectedCity === city
                  ? "bg-gold text-black border-gold font-bold shadow-gold"
                  : "bg-[#121217] text-[#A1A1AA] border-white/[0.08] hover:border-gold/30 hover:text-white"
              }`}
            >
              {city}
            </button>
          ))}
        </div>

        {/* Main Grid: Filters Sidebar + Salons List */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-[#121217]/95 p-5 rounded-2xl border border-white/[0.09] space-y-6 shadow-xl backdrop-blur-xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center">
                  <SlidersHorizontal className="w-3.5 h-3.5 mr-2 text-gold" />
                  Refine Search
                </span>
                <button
                  onClick={() => {
                    setSelectedCity("All");
                    setSelectedCategory("All");
                    setSearchQuery("");
                    setMinRating(0);
                    setMaxPrice(5000);
                  }}
                  className="text-[11px] text-gold hover:underline font-medium"
                >
                  Reset
                </button>
              </div>

              {/* Keyword Search */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#A1A1AA]">Keyword / Area</label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search salon or service..."
                    className="w-full bg-[#08080B] border border-white/[0.1] rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-gold placeholder-[#71717A] transition-colors"
                  />
                  <Search className="w-4 h-4 text-[#71717A] absolute left-3 top-2.5" />
                </div>
              </div>

              {/* Service Categories */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#A1A1AA]">Service Category</label>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${
                        selectedCategory === cat
                          ? "bg-gold/15 text-gold font-semibold border border-gold/30"
                          : "text-[#A1A1AA] hover:bg-[#08080B] hover:text-white"
                      }`}
                    >
                      <span>{cat}</span>
                      {selectedCategory === cat && <Check className="w-3.5 h-3.5 text-gold" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Min Rating */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-[#A1A1AA]">Minimum Rating</span>
                  <span className="text-gold font-bold">{minRating > 0 ? `${minRating}+ Stars` : "Any"}</span>
                </div>
                <div className="flex gap-2">
                  {[0, 4.5, 4.8, 4.9].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => setMinRating(rate)}
                      className={`flex-1 py-1.5 rounded-xl text-[11px] border font-medium transition-all ${
                        minRating === rate
                          ? "bg-gold text-black border-gold font-bold shadow-gold"
                          : "bg-[#08080B] text-[#A1A1AA] border-white/[0.08]"
                      }`}
                    >
                      {rate === 0 ? "All" : `${rate}+`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Max Price Range */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-[#A1A1AA]">Max Starting Price</span>
                  <span className="text-white font-bold">₹{maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="400"
                  max="5000"
                  step="100"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#D4AF37] cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Salons Result Column */}
          <div className="lg:col-span-3 space-y-6">
            {filteredSalons.length === 0 ? (
              <div className="bg-[#121217] rounded-3xl border border-white/[0.08] p-12 text-center space-y-4">
                <Scissors className="w-12 h-12 text-[#71717A] mx-auto" />
                <h3 className="text-lg font-bold text-white">No salons match your filters</h3>
                <p className="text-xs text-[#71717A] max-w-sm mx-auto">
                  Try clearing your search query or selecting a different city to see more luxury salons.
                </p>
                <button
                  onClick={() => {
                    setSelectedCity("All");
                    setSelectedCategory("All");
                    setSearchQuery("");
                  }}
                  className="gold-btn px-4 py-2 text-xs rounded-xl uppercase font-bold"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              filteredSalons.map((salon) => (
                <div
                  key={salon.id}
                  className="luxury-card rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row gap-6 group shadow-lg border border-white/[0.08] hover:border-gold/40"
                >
                  {/* Salon Thumbnail */}
                  <div className="relative w-full md:w-64 h-48 md:h-auto rounded-xl overflow-hidden shrink-0">
                    <Image
                      src={salon.bannerImage}
                      alt={salon.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md bg-[#08080B]/90 border border-white/[0.08] text-[10px] text-green-400 font-semibold backdrop-blur-md">
                      Now #{salon.currentServingToken}
                    </div>
                  </div>

                  {/* Salon Details */}
                  <div className="flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="text-xl font-bold text-white group-hover:text-gold transition-colors">
                              {salon.name}
                            </h3>
                            {salon.isVerified && (
                              <span title="Verified SalonX Partner">
                                <ShieldCheck className="w-4 h-4 text-gold shrink-0" />
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#A1A1AA] flex items-center mt-1">
                            <MapPin className="w-3.5 h-3.5 text-gold mr-1.5 shrink-0" />
                            {salon.address}, {salon.city}
                          </p>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-[#08080B] border border-white/[0.08] text-xs">
                          <Star className="w-3.5 h-3.5 text-gold fill-gold" />
                          <span className="font-bold text-white">{salon.rating}</span>
                          <span className="text-[#71717A]">({salon.reviewCount})</span>
                        </div>
                      </div>

                      <p className="text-xs text-[#71717A] mt-2 line-clamp-2">
                        {salon.description}
                      </p>
                    </div>

                    {/* Services and Barbers Bar */}
                    <div className="pt-2 border-t border-white/[0.06] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-[#71717A] font-semibold">
                          Available Barbers:
                        </span>
                        <div className="flex items-center space-x-2 mt-1">
                          {salon.staff.map((stf) => (
                            <div
                              key={stf.id}
                              className="text-[11px] px-2 py-0.5 rounded-lg bg-[#08080B] text-white border border-white/[0.06] flex items-center space-x-1"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                              <span>{stf.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-[#71717A] font-semibold">
                          Live Queue Status:
                        </span>
                        <p className="text-xs text-white mt-1 flex items-center space-x-2">
                          <span className="text-gold font-bold">{salon.activeQueueCount} in Queue</span>
                          <span className="text-[#71717A]">•</span>
                          <span>Est. wait: ~{salon.activeQueueCount * salon.estimatedWaitPerCustomerMinutes} mins</span>
                        </p>
                      </div>
                    </div>

                    {/* Footer Row */}
                    <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-[#71717A]">Starting From</p>
                        <p className="text-lg font-black text-gold">₹{salon.startingPrice}</p>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Link
                          href={`/salons/${salon.id}`}
                          className="px-4 py-2 text-xs font-semibold text-white bg-[#08080B] border border-white/[0.08] hover:border-gold rounded-xl transition-colors"
                        >
                          View Atelier
                        </Link>
                        <Link
                          href={`/book?salonId=${salon.id}`}
                          className="gold-btn px-5 py-2 text-xs rounded-xl shadow-gold uppercase tracking-wider font-bold"
                        >
                          Book / Join Queue
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SalonsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#08080B] p-8 text-gold">Loading luxury salons...</div>}>
      <SalonsContent />
    </Suspense>
  );
}
