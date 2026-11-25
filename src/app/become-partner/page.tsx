"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Store,
  CheckCircle2,
  Sparkles,
  MapPin,
  Clock,
  ShieldCheck,
  TrendingUp,
  Scissors,
  ArrowRight,
} from "lucide-react";
import { useSalonStore } from "@/lib/store/salonStore";

export default function BecomePartnerPage() {
  const { salons, updateSalon } = useSalonStore();

  const [salonName, setSalonName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [city, setCity] = useState("Mumbai");
  const [area, setArea] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [tagline, setTagline] = useState("");
  const [chairsCount, setChairsCount] = useState("4");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#08080B] py-12 pb-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Hero title */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-gold/15 text-gold border border-gold/30 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SalonX Partner Ecosystem</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Elevate Your Salon with <br />
            <span className="text-gold-gradient">Live Queue Technology</span>
          </h1>
          <p className="text-sm sm:text-base text-[#A1A1AA] max-w-2xl mx-auto leading-relaxed">
            Eliminate lobby wait times, maximize master barber utilization, and deliver a 5-star digital booking experience for your elite clientele.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#171719] p-6 rounded-2xl border border-charcoal-border space-y-2">
            <div className="w-10 h-10 rounded-xl bg-gold/15 flex items-center justify-center text-gold">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Zero Lobby Overcrowding</h3>
            <p className="text-xs text-[#A1A1AA]">
              Customers track live queues from their phones and walk in right before their chair is prepared.
            </p>
          </div>

          <div className="bg-[#171719] p-6 rounded-2xl border border-charcoal-border space-y-2">
            <div className="w-10 h-10 rounded-xl bg-gold/15 flex items-center justify-center text-gold">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">+35% Higher Throughput</h3>
            <p className="text-xs text-[#A1A1AA]">
              Dynamic barber scheduling optimizes chair turnarounds and fills unexpected cancellations instantly.
            </p>
          </div>

          <div className="bg-[#171719] p-6 rounded-2xl border border-charcoal-border space-y-2">
            <div className="w-10 h-10 rounded-xl bg-gold/15 flex items-center justify-center text-gold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">VIP Brand Prestige</h3>
            <p className="text-xs text-[#A1A1AA]">
              Join the certified luxury network of world-class barbershops and couture hair ateliers.
            </p>
          </div>
        </div>

        {/* Registration Form */}
        <div className="bg-[#171719] rounded-3xl border border-gold-border/40 p-6 sm:p-10 shadow-gold">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-gold/20 text-gold border border-gold/40 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-white">Application Submitted to Super Admin</h2>
              <p className="text-xs text-[#A1A1AA] max-w-md mx-auto">
                Thank you, {ownerName}. Our partner concierge team will review {salonName} and activate your live queue dashboard within 24 hours.
              </p>
              <div className="pt-4 flex justify-center space-x-4">
                <Link
                  href="/admin"
                  className="px-5 py-2.5 rounded-xl bg-gold text-black text-xs font-bold uppercase tracking-wider"
                >
                  View in Admin Approvals
                </Link>
                <Link
                  href="/"
                  className="px-5 py-2.5 rounded-xl bg-[#08080B] text-white border border-charcoal-border text-xs font-semibold"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="border-b border-charcoal-border/70 pb-4">
                <h3 className="text-lg font-bold text-white">Salon Partnership Application</h3>
                <p className="text-xs text-[#A1A1AA]">
                  Fill in your salon details for verification and listing on the SalonX platform.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="text-[#A1A1AA] font-semibold">Salon / Atelier Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Monte Carlo Barber Club"
                    value={salonName}
                    onChange={(e) => setSalonName(e.target.value)}
                    className="w-full bg-[#08080B] border border-charcoal-border rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-gold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#A1A1AA] font-semibold">Owner / Lead Barber Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. David Vance"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full bg-[#08080B] border border-charcoal-border rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-gold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#A1A1AA] font-semibold">City</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#08080B] border border-charcoal-border rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-gold"
                  >
                    <option value="Mumbai">Mumbai</option>
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="New Delhi">New Delhi</option>
                    <option value="Pune">Pune</option>
                    <option value="Dubai">Dubai</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[#A1A1AA] font-semibold">Area / Neighborhood</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bandra West, Indiranagar"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full bg-[#08080B] border border-charcoal-border rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-gold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#A1A1AA] font-semibold">Business Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98000 11223"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#08080B] border border-charcoal-border rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-gold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#A1A1AA] font-semibold">Business Email</label>
                  <input
                    type="email"
                    required
                    placeholder="partner@salon.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#08080B] border border-charcoal-border rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-gold"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[#A1A1AA] font-semibold">Atelier Philosophy / Tagline</label>
                  <input
                    type="text"
                    placeholder="e.g. Bespoke British Men's Grooming & Classic Shaving"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    className="w-full bg-[#08080B] border border-charcoal-border rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-8 py-3.5 rounded-xl bg-gold text-black font-extrabold text-xs uppercase tracking-wider hover:bg-gold-light transition-all shadow-gold flex items-center space-x-2"
                >
                  <span>Submit Partnership Application</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
