"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Star,
  Clock,
  Scissors,
  ShieldCheck,
  ChevronLeft,
  Sparkles,
  Heart,
  Share2,
  Phone,
  Mail,
  Award,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { useSalonStore } from "@/lib/store/salonStore";
import { MOCK_REVIEWS } from "@/lib/data/mockData";

export default function SalonDetailPage() {
  const router = useRouter();
  const params = useParams();
  const salonId = params?.id as string;
  const { salons } = useSalonStore();

  const salon =
    salons.find((s) => s.id === salonId || s.slug === salonId) ||
    salons.find((s) => s.id === "salon_aura_maison") ||
    salons[0];
  const reviews = MOCK_REVIEWS.filter((r) => r.salon_id === salon.id);

  const [activeTab, setActiveTab] = useState<"services" | "about" | "reviews">("services");
  const [serviceFilter, setServiceFilter] = useState<string>("All");
  const [isFavorite, setIsFavorite] = useState(false);

  // Calculate pricing breakdown for quick overview
  const haircutServices = salon.services.filter(
    (s) =>
      s.category.toLowerCase().includes("hair") ||
      s.name.toLowerCase().includes("hair") ||
      s.name.toLowerCase().includes("cut") ||
      s.name.toLowerCase().includes("taper") ||
      s.name.toLowerCase().includes("fade")
  );
  const beardServices = salon.services.filter(
    (s) =>
      s.category.toLowerCase().includes("beard") ||
      s.name.toLowerCase().includes("beard") ||
      s.name.toLowerCase().includes("shave")
  );
  const spaServices = salon.services.filter(
    (s) =>
      s.category.toLowerCase().includes("spa") ||
      s.category.toLowerCase().includes("facial") ||
      s.category.toLowerCase().includes("color") ||
      s.name.toLowerCase().includes("spa") ||
      s.name.toLowerCase().includes("facial") ||
      s.name.toLowerCase().includes("balayage")
  );

  const minHaircutPrice = haircutServices.length
    ? Math.min(...haircutServices.map((s) => s.price))
    : null;
  const minBeardPrice = beardServices.length
    ? Math.min(...beardServices.map((s) => s.price))
    : null;
  const minSpaPrice = spaServices.length
    ? Math.min(...spaServices.map((s) => s.price))
    : null;

  // Filtered services list
  const filteredServices = salon.services.filter((s) => {
    if (serviceFilter === "All") return true;
    if (serviceFilter === "Haircut") {
      return (
        s.category.toLowerCase().includes("hair") ||
        s.name.toLowerCase().includes("hair") ||
        s.name.toLowerCase().includes("cut") ||
        s.name.toLowerCase().includes("fade")
      );
    }
    if (serviceFilter === "Beard") {
      return (
        s.category.toLowerCase().includes("beard") ||
        s.name.toLowerCase().includes("beard") ||
        s.name.toLowerCase().includes("shave")
      );
    }
    if (serviceFilter === "Spa") {
      return (
        s.category.toLowerCase().includes("spa") ||
        s.category.toLowerCase().includes("facial") ||
        s.category.toLowerCase().includes("color") ||
        s.name.toLowerCase().includes("spa") ||
        s.name.toLowerCase().includes("facial")
      );
    }
    return true;
  });

  // Pre-configured feature badges matching the luxury atelier standard
  const featureBadges = [
    { label: "Expert Stylists", icon: Scissors },
    { label: "Premium Products", icon: Sparkles },
    { label: "Hygienic Salon", icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen bg-[#08080B] text-[#F4F4F5] pb-28 pt-4">
      <div className="max-w-2xl sm:max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
        {/* 1. HERO SALON IMAGE CARD */}
        <div className="relative h-64 sm:h-80 w-full rounded-3xl overflow-hidden shadow-2xl border border-white/[0.08] group">
          <Image
            src={salon.bannerImage}
            alt={salon.name}
            fill
            priority
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

          {/* Floating Action Buttons */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            {/* Back Button */}
            <Link
              href="/salons"
              className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/90 transition-all shadow-lg"
              title="Back to salons"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>

            {/* Favorite Button */}
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/90 transition-all shadow-lg"
              title="Save to favorites"
            >
              <Heart
                className={`w-5 h-5 transition-colors ${
                  isFavorite ? "text-gold fill-gold" : "text-white"
                }`}
              />
            </button>
          </div>
        </div>

        {/* 2. SALON METADATA & TITLE */}
        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {salon.name}
          </h1>

          {/* Rating Line */}
          <div className="flex items-center space-x-2 text-sm">
            <div className="flex items-center text-[#F5C443] font-bold">
              <Star className="w-4 h-4 fill-[#F5C443] mr-1" />
              <span>{salon.rating}</span>
            </div>
            <span className="text-[#71717A]">({salon.reviewCount} reviews)</span>
          </div>

          {/* Location Line */}
          <div className="flex items-center text-xs text-[#A1A1AA]">
            <MapPin className="w-4 h-4 text-gold mr-1.5 shrink-0" />
            <span>{salon.address}, {salon.city}</span>
          </div>

          {/* Feature Badges (Pills) */}
          <div className="pt-2 flex flex-wrap items-center gap-2.5">
            {featureBadges.map((badge) => {
              const Icon = badge.icon;
              return (
                <div
                  key={badge.label}
                  className="px-3.5 py-1.5 rounded-full bg-[#121217] border border-white/[0.08] text-xs text-[#D4D4D8] flex items-center space-x-1.5 shadow-sm"
                >
                  <Icon className="w-3.5 h-3.5 text-gold" />
                  <span>{badge.label}</span>
                </div>
              );
            })}
          </div>

          {/* Live Queue Status Pill */}
          <div className="p-3.5 rounded-2xl bg-[#121217] border border-white/[0.08] flex items-center justify-between text-xs mt-3 shadow-md">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gold" />
              <span className="font-semibold text-white">Live Floor Queue:</span>
              <span className="text-gold font-bold">Serving #{salon.currentServingToken}</span>
              <span className="text-[#71717A]">•</span>
              <span className="text-[#A1A1AA]">{salon.activeQueueCount} Waiting</span>
            </div>
            <Link
              href={`/book?salonId=${salon.id}&type=walk_in`}
              className="text-[11px] font-bold uppercase tracking-wider text-gold hover:underline"
            >
              Join Queue
            </Link>
          </div>
        </div>

        {/* 3. TABS NAVIGATION */}
        <div className="border-b border-white/[0.1] pt-2">
          <div className="flex items-center space-x-8 text-sm">
            <button
              onClick={() => setActiveTab("services")}
              className={`pb-3 font-bold transition-all relative ${
                activeTab === "services"
                  ? "text-gold"
                  : "text-[#71717A] hover:text-[#D4D4D8]"
              }`}
            >
              Services
              {activeTab === "services" && (
                <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#E5C564] to-[#D4AF37] rounded-full shadow-[0_0_8px_#D4AF37]" />
              )}
            </button>

            <button
              onClick={() => setActiveTab("about")}
              className={`pb-3 font-bold transition-all relative ${
                activeTab === "about"
                  ? "text-gold"
                  : "text-[#71717A] hover:text-[#D4D4D8]"
              }`}
            >
              About
              {activeTab === "about" && (
                <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#E5C564] to-[#D4AF37] rounded-full shadow-[0_0_8px_#D4AF37]" />
              )}
            </button>

            <button
              onClick={() => setActiveTab("reviews")}
              className={`pb-3 font-bold transition-all relative ${
                activeTab === "reviews"
                  ? "text-gold"
                  : "text-[#71717A] hover:text-[#D4D4D8]"
              }`}
            >
              Reviews ({reviews.length})
              {activeTab === "reviews" && (
                <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#E5C564] to-[#D4AF37] rounded-full shadow-[0_0_8px_#D4AF37]" />
              )}
            </button>
          </div>
        </div>

        {/* 4. TAB CONTENTS */}
        {activeTab === "services" && (
          <div className="space-y-5 pt-1">
            {/* Quick Price Overview Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3 rounded-2xl bg-[#121217] border border-white/[0.08]">
              {minHaircutPrice !== null && (
                <div
                  onClick={() => setServiceFilter("Haircut")}
                  className={`flex items-center space-x-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                    serviceFilter === "Haircut"
                      ? "bg-gold/15 border-gold shadow-[0_0_12px_rgba(212,175,55,0.2)]"
                      : "bg-[#08080B] border-white/[0.06] hover:border-gold/40"
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                    <Scissors className="w-4 h-4 text-gold" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-[#71717A] font-semibold">Haircut From</p>
                    <p className="text-sm font-black text-white">₹{minHaircutPrice}</p>
                  </div>
                </div>
              )}

              {minBeardPrice !== null && (
                <div
                  onClick={() => setServiceFilter("Beard")}
                  className={`flex items-center space-x-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                    serviceFilter === "Beard"
                      ? "bg-gold/15 border-gold shadow-[0_0_12px_rgba(212,175,55,0.2)]"
                      : "bg-[#08080B] border-white/[0.06] hover:border-gold/40"
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center shrink-0 text-xs">
                    🧔
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-[#71717A] font-semibold">Beard From</p>
                    <p className="text-sm font-black text-white">₹{minBeardPrice}</p>
                  </div>
                </div>
              )}

              {minSpaPrice !== null && (
                <div
                  onClick={() => setServiceFilter("Spa")}
                  className={`flex items-center space-x-2.5 p-2.5 rounded-xl border cursor-pointer transition-all col-span-2 sm:col-span-1 ${
                    serviceFilter === "Spa"
                      ? "bg-gold/15 border-gold shadow-[0_0_12px_rgba(212,175,55,0.2)]"
                      : "bg-[#08080B] border-white/[0.06] hover:border-gold/40"
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-gold" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-[#71717A] font-semibold">Spa & Care From</p>
                    <p className="text-sm font-black text-white">₹{minSpaPrice}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {[
                { id: "All", label: "All Services" },
                { id: "Haircut", label: "Haircuts" },
                { id: "Beard", label: "Beard & Shave" },
                { id: "Spa", label: "Spa & Treatments" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setServiceFilter(tab.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                    serviceFilter === tab.id
                      ? "bg-gold text-black border-gold shadow-gold font-bold"
                      : "bg-[#121217] text-[#A1A1AA] border-white/[0.08] hover:text-white hover:border-white/20"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Services List */}
            <div className="divide-y divide-white/[0.06]">
              {filteredServices.length === 0 ? (
                <p className="text-xs text-[#71717A] py-8 text-center">No services found in this category.</p>
              ) : (
                filteredServices.map((service) => (
                  <div
                    key={service.id}
                    className="py-4 flex items-center justify-between gap-4 group hover:bg-white/[0.02] px-2 -mx-2 rounded-2xl transition-colors"
                  >
                    {/* Left: Thumbnail & Details */}
                    <div className="flex items-center space-x-3.5 min-w-0">
                      <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden shrink-0 border border-white/[0.08] bg-[#121217]">
                        <Image
                          src={
                            service.image_url ||
                            "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=300&auto=format&fit=crop"
                          }
                          alt={service.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-sm sm:text-base font-bold text-white truncate group-hover:text-gold transition-colors">
                            {service.name}
                          </h3>
                        </div>
                        <p className="text-xs text-[#71717A] mt-0.5 flex items-center space-x-1.5">
                          <span>{service.durationMinutes} mins</span>
                          <span>•</span>
                          <span className="text-[#A1A1AA]">{service.category}</span>
                        </p>
                        {service.description && (
                          <p className="text-[11px] text-[#A1A1AA]/80 line-clamp-1 mt-0.5 max-w-sm hidden sm:block">
                            {service.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right: Price & Book Button */}
                    <div className="flex items-center space-x-4 shrink-0">
                      <span className="text-base sm:text-lg font-black text-white">
                        ₹{service.price}
                      </span>

                      <Link
                        href={`/book?salonId=${salon.id}&serviceId=${service.id}`}
                        className="bg-[#F5C443] hover:bg-[#e6b636] active:scale-95 text-black font-bold px-5 sm:px-6 py-2 rounded-xl text-xs sm:text-sm transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
                      >
                        Book
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ABOUT TAB */}
        {activeTab === "about" && (
          <div className="space-y-6 pt-2">
            <div className="bg-[#121217] rounded-2xl p-5 border border-white/[0.08] space-y-3">
              <h3 className="text-sm uppercase font-bold text-gold tracking-wider">
                About the Atelier
              </h3>
              <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed">
                {salon.description}
              </p>
            </div>

            {/* Amenities */}
            <div className="bg-[#121217] rounded-2xl p-5 border border-white/[0.08] space-y-3">
              <h3 className="text-sm uppercase font-bold text-gold tracking-wider">
                Amenities & Experience
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {salon.amenities.map((item) => (
                  <div key={item} className="flex items-center space-x-2 text-xs text-[#D4D4D8]">
                    <CheckCircle2 className="w-4 h-4 text-gold shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Operating Hours */}
            <div className="bg-[#121217] rounded-2xl p-5 border border-white/[0.08] space-y-3">
              <h3 className="text-sm uppercase font-bold text-gold tracking-wider">
                Operating Hours
              </h3>
              <div className="space-y-2 text-xs">
                {salon.openingHours.map((h) => (
                  <div key={h.day} className="flex justify-between py-1 border-b border-white/[0.04]">
                    <span className="text-[#A1A1AA]">{h.day}</span>
                    <span className="font-semibold text-white">
                      {h.isOpen ? `${h.open} - ${h.close}` : "Closed"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stylists Roster */}
            <div className="bg-[#121217] rounded-2xl p-5 border border-white/[0.08] space-y-3">
              <h3 className="text-sm uppercase font-bold text-gold tracking-wider">
                Master Stylists
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {salon.staff.map((stf) => (
                  <div
                    key={stf.id}
                    className="p-3 rounded-xl bg-[#08080B] border border-white/[0.06] flex items-center space-x-3"
                  >
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/[0.08]">
                      <Image
                        src={stf.avatar_url}
                        alt={stf.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{stf.name}</p>
                      <p className="text-[10px] text-gold">{stf.roleTitle}</p>
                      <p className="text-[10px] text-[#71717A] flex items-center mt-0.5">
                        <Star className="w-3 h-3 text-gold fill-gold mr-0.5" />
                        {stf.rating} ({stf.reviewsCount})
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* REVIEWS TAB */}
        {activeTab === "reviews" && (
          <div className="space-y-4 pt-2">
            {reviews.length === 0 ? (
              <p className="text-xs text-[#71717A] py-8 text-center">No reviews yet for this salon.</p>
            ) : (
              reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 rounded-2xl bg-[#121217] border border-white/[0.06] space-y-2 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{rev.customer_name}</span>
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 text-gold fill-gold" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-[#A1A1AA] leading-relaxed">{rev.comment}</p>
                  <p className="text-[10px] text-[#71717A]">{rev.service_name} • {rev.date}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
