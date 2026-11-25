"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Shield,
  Store,
  Users,
  DollarSign,
  CheckCircle2,
  XCircle,
  AlertCircle,
  TrendingUp,
  Percent,
  Sliders,
  Sparkles,
  Search,
  Filter,
  Star,
} from "lucide-react";
import { useSalonStore } from "@/lib/store/salonStore";
import { MOCK_USERS } from "@/lib/data/mockData";

export default function SuperAdminDashboard() {
  const { salons, bookings, metrics, setSalonApproval, resetDemoData } = useSalonStore();

  const [activeTab, setActiveTab] = useState<"salons" | "approvals" | "users" | "financials">("approvals");
  const [commissionRate, setCommissionRate] = useState(15);
  const [searchTerm, setSearchTerm] = useState("");

  const pendingSalons = salons.filter((s) => s.status === "pending");
  const activeSalons = salons.filter((s) => s.status === "active");

  const totalCalculatedRevenue = bookings
    .filter((b) => b.status === "completed")
    .reduce((sum, b) => sum + b.totalAmount, 0) + metrics.platformRevenue;

  const commissionEarned = Math.round((totalCalculatedRevenue * commissionRate) / 100);

  return (
    <div className="min-h-screen bg-[#08080B] py-10 pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-charcoal-border/70 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gold/15 text-gold border border-gold/30 text-xs font-semibold mb-2">
              <Shield className="w-3.5 h-3.5" />
              <span>Platform Master Console</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              SalonX Super Administration
            </h1>
            <p className="text-xs text-[#A1A1AA] mt-1">
              Centralized ecosystem oversight, salon verification, and revenue intelligence.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={resetDemoData}
              className="px-4 py-2 rounded-xl bg-[#171719] border border-charcoal-border hover:border-gold text-xs text-[#A1A1AA] hover:text-white transition-colors"
            >
              Reset Demo Records
            </button>
          </div>
        </div>

        {/* METRICS CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#121217] p-5 rounded-2xl border border-white/[0.08] shadow-lg">
            <div className="flex items-center justify-between text-xs text-[#71717A]">
              <span>Active Salons</span>
              <Store className="w-4 h-4 text-gold" />
            </div>
            <p className="text-3xl font-extrabold text-white mt-2">{activeSalons.length}</p>
            <p className="text-[11px] text-green-400 mt-1 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              {pendingSalons.length} pending verification
            </p>
          </div>

          <div className="bg-[#121217] p-5 rounded-2xl border border-gold/40 shadow-gold">
            <div className="flex items-center justify-between text-xs text-gold">
              <span>Platform Revenue</span>
              <DollarSign className="w-4 h-4 text-gold" />
            </div>
            <p className="text-3xl font-extrabold text-gold mt-2">₹{totalCalculatedRevenue.toLocaleString()}</p>
            <p className="text-[11px] text-[#A1A1AA] mt-1">
              Commission ({commissionRate}%): ₹{commissionEarned.toLocaleString()}
            </p>
          </div>

          <div className="bg-[#121217] p-5 rounded-2xl border border-white/[0.08] shadow-lg">
            <div className="flex items-center justify-between text-xs text-[#71717A]">
              <span>Registered Clients</span>
              <Users className="w-4 h-4 text-gold" />
            </div>
            <p className="text-3xl font-extrabold text-white mt-2">
              {metrics.totalCustomers.toLocaleString()}
            </p>
            <p className="text-[11px] text-green-400 mt-1">+142 this week</p>
          </div>

          <div className="bg-[#121217] p-5 rounded-2xl border border-white/[0.08] shadow-lg">
            <div className="flex items-center justify-between text-xs text-[#71717A]">
              <span>Total Bookings</span>
              <Sparkles className="w-4 h-4 text-gold" />
            </div>
            <p className="text-3xl font-extrabold text-white mt-2">
              {(metrics.totalBookings + bookings.length).toLocaleString()}
            </p>
            <p className="text-[11px] text-[#71717A] mt-1">99.8% Queue Accuracy</p>
          </div>
        </div>

        {/* TABS */}
        <div className="flex space-x-2 border-b border-charcoal-border/70 pb-2">
          {[
            { id: "approvals", label: "Pending Approvals", count: pendingSalons.length },
            { id: "salons", label: "Verified Salons", count: activeSalons.length },
            { id: "users", label: "User Management", count: MOCK_USERS.length },
            { id: "financials", label: "Commission & Settings" },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-gold text-black shadow-gold font-bold"
                    : "text-[#A1A1AA] hover:bg-[#171719] hover:text-white"
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive ? "bg-black text-gold font-bold" : "bg-gold/20 text-gold"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: PENDING SALON APPROVALS */}
        {activeTab === "approvals" && (
          <div className="bg-[#171719] rounded-2xl border border-charcoal-border p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-charcoal-border/50">
              <h3 className="text-base font-bold text-white">
                New Partner Registrations Awaiting Verification
              </h3>
              <span className="text-xs text-gold font-semibold">
                {pendingSalons.length} Require Review
              </span>
            </div>

            {pendingSalons.length === 0 ? (
              <div className="p-10 text-center text-xs text-[#71717A] space-y-2">
                <CheckCircle2 className="w-10 h-10 text-green-500/50 mx-auto" />
                <p className="text-white font-semibold">All salon partner applications are reviewed</p>
                <p>New registrations through the &apos;Become a Partner&apos; portal will appear here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingSalons.map((salon) => (
                  <div
                    key={salon.id}
                    className="p-5 rounded-xl bg-[#08080B] border border-gold/30 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-charcoal-border">
                        <Image src={salon.bannerImage} alt={salon.name} fill className="object-cover" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-bold text-white">{salon.name}</h4>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 uppercase font-semibold">
                            Pending Audit
                          </span>
                        </div>
                        <p className="text-xs text-[#A1A1AA]">{salon.address}, {salon.city}</p>
                        <div className="flex items-center space-x-3 text-[11px] text-[#71717A]">
                          <span>Phone: {salon.phone}</span>
                          <span>•</span>
                          <span>Email: {salon.email}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        onClick={() => setSalonApproval(salon.id, "active")}
                        className="px-4 py-2 rounded-xl bg-green-500 text-black text-xs font-bold uppercase tracking-wider hover:bg-green-400 transition-all flex items-center space-x-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve Salon</span>
                      </button>
                      <button
                        onClick={() => setSalonApproval(salon.id, "rejected")}
                        className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold uppercase hover:bg-red-500/30 transition-all flex items-center space-x-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: VERIFIED SALONS LIST */}
        {activeTab === "salons" && (
          <div className="bg-[#171719] rounded-2xl border border-charcoal-border p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Verified Luxury Network</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-charcoal-border text-[#71717A] uppercase">
                    <th className="py-3 px-3">Salon</th>
                    <th className="py-3 px-3">Location</th>
                    <th className="py-3 px-3">Rating</th>
                    <th className="py-3 px-3">Services</th>
                    <th className="py-3 px-3">Queue Status</th>
                    <th className="py-3 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-charcoal-border/40">
                  {activeSalons.map((s) => (
                    <tr key={s.id} className="hover:bg-[#08080B]/50 text-[#A1A1AA]">
                      <td className="py-3 px-3 text-white font-bold">{s.name}</td>
                      <td className="py-3 px-3">{s.area}, {s.city}</td>
                      <td className="py-3 px-3 text-gold font-bold">
                        <div className="flex items-center space-x-1">
                          <Star className="w-3.5 h-3.5 fill-gold text-gold" />
                          <span>{s.rating}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3">{s.services.length} items</td>
                      <td className="py-3 px-3 text-green-400">Serving #{s.currentServingToken}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gold/15 text-gold border border-gold/30">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: USER MANAGEMENT */}
        {activeTab === "users" && (
          <div className="bg-[#171719] rounded-2xl border border-charcoal-border p-6 space-y-4">
            <h3 className="text-base font-bold text-white">System Accounts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MOCK_USERS.map((usr) => (
                <div
                  key={usr.id}
                  className="p-4 rounded-xl bg-[#08080B] border border-charcoal-border flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold">
                      {usr.name[0]}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{usr.name}</h4>
                      <p className="text-[11px] text-[#A1A1AA]">{usr.email}</p>
                      <p className="text-[10px] text-[#71717A]">{usr.phone}</p>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold/15 text-gold border border-gold/30 uppercase font-bold">
                    {usr.role.replace("_", " ")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: COMMISSION & SETTINGS */}
        {activeTab === "financials" && (
          <div className="bg-[#171719] rounded-2xl border border-charcoal-border p-6 space-y-6 max-w-xl">
            <h3 className="text-base font-bold text-white">Commission & Marketplace Settings</h3>

            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-[#A1A1AA] font-semibold">Platform Commission Rate</span>
                <span className="text-gold font-bold text-sm">{commissionRate}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="30"
                value={commissionRate}
                onChange={(e) => setCommissionRate(Number(e.target.value))}
                className="w-full accent-[#D4AF37] cursor-pointer"
              />
              <p className="text-[11px] text-[#71717A]">
                Commission applies automatically to completed appointment payouts and queue settlements.
              </p>
            </div>

            <div className="pt-4 border-t border-charcoal-border space-y-3">
              <h4 className="text-xs font-bold text-white uppercase">Platform Gateway Mode</h4>
              <div className="p-3 rounded-xl bg-[#08080B] border border-charcoal-border flex items-center justify-between text-xs">
                <span>Supabase Live Realtime PubSub</span>
                <span className="text-green-400 font-bold">Enabled (Active)</span>
              </div>
              <div className="p-3 rounded-xl bg-[#08080B] border border-charcoal-border flex items-center justify-between text-xs">
                <span>Atomic Token Concurrency Lock</span>
                <span className="text-green-400 font-bold">Safe (Stored Procedure)</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
