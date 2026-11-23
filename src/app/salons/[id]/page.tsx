"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Star,
  Clock,
  Scissors,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Check,
  User,
  Coffee,
  Wifi,
  Calendar,
  Share2,
} from "lucide-react";
import { useSalonStore } from "@/lib/store/salonStore";
import { MOCK_REVIEWS } from "@/lib/data/mockData";

export default function SalonDetailPage() {
  const router = useRouter();
  const params = useParams();
  const salonId = params?.id as string;
  const { salons } = useSalonStore();

  const salon = salons.find((s) => s.id === salonId) || salons[0];
  const reviews = MOCK_REVIEWS.filter((r) => r.salon_id === salon.id);

  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    ...Array.from(new Set(salon.services.map((s) => s.category))),
  ];

  const displayedServices =
    selectedCategory === "All"
      ? salon.services
      : salon.services.filter((s) => s.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#0B0B0D] pb-24">
      {/* 1. HERO BANNER */}
      <div className="relative h-72 sm:h-96 w-full">
        <Image
          src={salon.bannerImage}
          alt={salon.name}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0D] via-[#0B0B0D]/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0D]/80 via-transparent to-[#0B0B0D]/80"></div>

        {/* Back navigation */}
        <div className="absolute top-6 left-4 sm:left-8 z-10">
          <Link
            href="/salons"
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#0B0B0D]/80 backdrop-blur-md border border-charcoal-border text-xs text-white hover:border-gold transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Back to Salons</span>
          </Link>
        </div>
      </div>

      {/* 2. SALON HEADER CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
        <div className="bg-[#171719] rounded-2xl border border-charcoal-border p-6 sm:p-8 shadow-luxury">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-charcoal-border/60">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
                  {salon.name}
                </h1>
                {salon.isVerified && (
                  <span className="inline-flex items-center text-xs px-2.5 py-1 rounded-full bg-gold/15 text-gold border border-gold/30">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                    Verified Atelier
                  </span>
                )}
              </div>
              <p className="text-sm text-gold font-medium">{salon.tagline}</p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-[#A1A1AA]">
                <span className="flex items-center">
                  <MapPin className="w-3.5 h-3.5 text-gold mr-1" />
                  {salon.address}, {salon.city}
                </span>
                <span className="flex items-center">
                  <Phone className="w-3.5 h-3.5 text-gold mr-1" />
                  {salon.phone}
                </span>
                <span className="flex items-center">
                  <Mail className="w-3.5 h-3.5 text-gold mr-1" />
                  {salon.email}
                </span>
              </div>
            </div>

            {/* Quick action buttons & Rating */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 shrink-0">
              <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-[#0B0B0D] border border-gold-border/30">
                <Star className="w-4 h-4 text-gold fill-gold" />
                <span className="text-sm font-bold text-white">{salon.rating}</span>
                <span className="text-xs text-[#71717A]">({salon.reviewCount} reviews)</span>
              </div>

              <div className="flex items-center space-x-2">
                <Link
                  href={`/book?salonId=${salon.id}&type=walk_in`}
                  className="px-4 py-2.5 rounded-xl bg-[#0B0B0D] border border-gold text-gold text-xs font-semibold uppercase tracking-wider hover:bg-gold/10 transition-colors"
                >
                  Join Live Queue
                </Link>
                <Link
                  href={`/book?salonId=${salon.id}&type=appointment`}
                  className="px-5 py-2.5 rounded-xl bg-gold text-black text-xs font-semibold uppercase tracking-wider hover:bg-gold-light transition-all shadow-gold"
                >
                  Book Appointment
                </Link>
              </div>
            </div>
          </div>

          {/* Live Queue Banner in Salon Profile */}
          <div className="mt-6 p-4 rounded-xl bg-[#0B0B0D] border border-charcoal-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
              <div>
                <p className="text-xs text-[#A1A1AA] uppercase font-semibold">Live Salon Queue</p>
                <p className="text-sm text-white font-bold">
                  Currently Serving <span className="text-gold">#{salon.currentServingToken}</span> • {salon.activeQueueCount} in Line
                </p>
              </div>
            </div>
            <div className="text-xs text-[#A1A1AA] text-right">
              <span>Estimated Wait: </span>
              <span className="text-white font-bold">
                ~{salon.activeQueueCount * salon.estimatedWaitPerCustomerMinutes} mins
              </span>
            </div>
          </div>
        </div>

        {/* 3. MAIN CONTENT: 2 COLUMNS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Left Column: Services & Barbers */}
          <div className="lg:col-span-2 space-y-8">
            {/* Services Section */}
            <div className="bg-[#171719] rounded-2xl border border-charcoal-border p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <Scissors className="w-5 h-5 text-gold mr-2" />
                  Service Menu
                </h2>
                <span className="text-xs text-[#A1A1AA]">
                  {displayedServices.length} offerings
                </span>
              </div>

              {/* Service Categories Filter */}
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      selectedCategory === cat
                        ? "bg-gold text-black font-semibold"
                        : "bg-[#0B0B0D] text-[#A1A1AA] border border-charcoal-border hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Services List */}
              <div className="space-y-3">
                {displayedServices.map((service) => (
                  <div
                    key={service.id}
                    className="p-4 rounded-xl bg-[#0B0B0D] border border-charcoal-border hover:border-gold/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-bold text-white">{service.name}</h4>
                        {service.popular && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold/15 text-gold border border-gold/25 font-semibold">
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#A1A1AA] max-w-lg">{service.description}</p>
                      <div className="flex items-center space-x-3 text-xs text-[#71717A] pt-1">
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1 text-gold" />
                          {service.durationMinutes} mins
                        </span>
                        <span>•</span>
                        <span>{service.category}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end space-x-4 shrink-0">
                      <p className="text-base font-extrabold text-gold">₹{service.price}</p>
                      <Link
                        href={`/book?salonId=${salon.id}&serviceId=${service.id}`}
                        className="px-4 py-2 rounded-lg bg-[#171719] border border-charcoal-border hover:border-gold text-xs text-white font-medium hover:text-gold transition-colors"
                      >
                        Select & Book
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Master Barbers & Staff Roster */}
            <div className="bg-[#171719] rounded-2xl border border-charcoal-border p-6 space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center">
                <Sparkles className="w-5 h-5 text-gold mr-2" />
                Master Stylists & Barbers
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {salon.staff.map((staff) => (
                  <div
                    key={staff.id}
                    className="p-4 rounded-xl bg-[#0B0B0D] border border-charcoal-border flex items-center space-x-4"
                  >
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-gold-border/30">
                      <Image
                        src={staff.avatar_url}
                        alt={staff.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-white">{staff.name}</h4>
                      <p className="text-xs text-gold">{staff.roleTitle}</p>
                      <div className="flex items-center space-x-2 text-[11px] text-[#A1A1AA]">
                        <span className="flex items-center text-white">
                          <Star className="w-3 h-3 text-gold fill-gold mr-0.5" />
                          {staff.rating}
                        </span>
                        <span>({staff.reviewsCount} reviews)</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Reviews Section */}
            <div className="bg-[#171719] rounded-2xl border border-charcoal-border p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <Star className="w-5 h-5 text-gold fill-gold mr-2" />
                  Client Reviews & Experiences
                </h2>
                <span className="text-xs text-[#A1A1AA]">{reviews.length} reviews</span>
              </div>

              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-xl bg-[#0B0B0D] border border-charcoal-border space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-7 h-7 rounded-full bg-[#171719] border border-charcoal-border flex items-center justify-center text-xs font-bold text-gold">
                          {rev.customer_name[0]}
                        </div>
                        <span className="text-xs font-bold text-white">{rev.customer_name}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-gold fill-gold" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-[#A1A1AA] leading-relaxed">{rev.comment}</p>
                    <p className="text-[10px] text-[#71717A]">{rev.service_name} • {rev.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Operating Hours, Amenities & Location */}
          <div className="space-y-6">
            {/* Operating Hours Box */}
            <div className="bg-[#171719] rounded-2xl border border-charcoal-border p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center">
                <Clock className="w-4 h-4 text-gold mr-2" />
                Operating Hours
              </h3>
              <div className="space-y-2 text-xs">
                {salon.openingHours.map((h) => (
                  <div
                    key={h.day}
                    className="flex justify-between py-1 border-b border-charcoal-border/40"
                  >
                    <span className="text-[#A1A1AA]">{h.day}</span>
                    <span className="text-white font-medium">
                      {h.isOpen ? `${h.open} - ${h.close}` : "Closed"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Atelier Amenities */}
            <div className="bg-[#171719] rounded-2xl border border-charcoal-border p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center">
                <Sparkles className="w-4 h-4 text-gold mr-2" />
                Atelier Amenities
              </h3>
              <ul className="space-y-2.5 text-xs text-[#A1A1AA]">
                {salon.amenities.map((am, i) => (
                  <li key={i} className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-gold shrink-0" />
                    <span>{am}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Gallery Images */}
            {salon.galleryImages.length > 0 && (
              <div className="bg-[#171719] rounded-2xl border border-charcoal-border p-6 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                  Gallery
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {salon.galleryImages.map((img, idx) => (
                    <div key={idx} className="relative h-24 rounded-lg overflow-hidden">
                      <Image
                        src={img}
                        alt="Salon Interior"
                        fill
                        className="object-cover hover:scale-110 transition-transform"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
