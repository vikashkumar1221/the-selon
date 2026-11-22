"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  User,
  Calendar,
  Clock,
  Ticket,
  Heart,
  Bell,
  XCircle,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  Star,
} from "lucide-react";
import { useSalonStore } from "@/lib/store/salonStore";
import { Booking } from "@/types";

export default function CustomerDashboard() {
  const { bookings, currentUser, salons, updateBookingStatus } = useSalonStore();

  const [activeTab, setActiveTab] = useState<"upcoming" | "history" | "favorites" | "profile">("upcoming");
  const [cancelModalBooking, setCancelModalBooking] = useState<Booking | null>(null);
  const [cancellationReason, setCancellationReason] = useState("Change of schedule");

  // Profile fields state
  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone);
  const [email, setEmail] = useState(currentUser.email);
  const [profileSaved, setProfileSaved] = useState(false);

  // Filter bookings for this customer
  const myBookings = useMemo(() => {
    return bookings.filter(
      (b) => b.customerId === currentUser.id || b.customerPhone === currentUser.phone
    );
  }, [bookings, currentUser]);

  const upcomingBookings = myBookings.filter(
    (b) => b.status === "confirmed" || b.status === "in_service"
  );
  const pastBookings = myBookings.filter(
    (b) => b.status === "completed" || b.status === "cancelled"
  );

  const favoriteSalons = salons.filter((s) => s.isVerified);

  const handleCancelBooking = () => {
    if (!cancelModalBooking) return;
    updateBookingStatus(cancelModalBooking.id, "cancelled", cancellationReason);
    setCancelModalBooking(null);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#0B0B0D] py-10 pb-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Profile Card Header */}
        <div className="bg-[#171719] rounded-2xl border border-charcoal-border p-6 shadow-luxury flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gold/20 border border-gold/40 flex items-center justify-center text-gold font-bold text-2xl shrink-0">
              {currentUser.name ? currentUser.name[0] : "A"}
            </div>
            <div className="text-center sm:text-left">
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white">{currentUser.name}</h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold/15 text-gold border border-gold/30 font-semibold uppercase">
                  VIP Patron
                </span>
              </div>
              <p className="text-xs text-[#A1A1AA] mt-1">{currentUser.phone} • {currentUser.email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/queue"
              className="px-4 py-2 rounded-xl bg-gold text-black text-xs font-bold uppercase tracking-wider hover:bg-gold-light transition-all flex items-center space-x-1.5 shadow-gold"
            >
              <Clock className="w-4 h-4" />
              <span>Track Live Queue</span>
            </Link>
            <Link
              href="/book"
              className="px-4 py-2 rounded-xl bg-[#0B0B0D] text-white border border-charcoal-border hover:border-gold text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              New Booking
            </Link>
          </div>
        </div>

        {/* TAB BUTTONS */}
        <div className="flex space-x-2 border-b border-charcoal-border/70 pb-2 overflow-x-auto">
          {[
            { id: "upcoming", label: "Upcoming Appointments & Tokens", count: upcomingBookings.length },
            { id: "history", label: "Past Visits & Receipts", count: pastBookings.length },
            { id: "favorites", label: "Favourite Salons", count: favoriteSalons.length },
            { id: "profile", label: "Profile & Preferences" },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
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

        {/* TAB 1: UPCOMING BOOKINGS */}
        {activeTab === "upcoming" && (
          <div className="space-y-4">
            {upcomingBookings.length === 0 ? (
              <div className="bg-[#171719] rounded-2xl border border-charcoal-border p-12 text-center space-y-3">
                <Ticket className="w-10 h-10 text-[#71717A] mx-auto" />
                <h3 className="text-base font-bold text-white">No upcoming appointments</h3>
                <p className="text-xs text-[#A1A1AA]">
                  Ready for a master haircut or hot towel shave? Book a session now.
                </p>
                <Link
                  href="/book"
                  className="inline-block px-5 py-2.5 rounded-xl bg-gold text-black font-bold text-xs uppercase"
                >
                  Book Appointment
                </Link>
              </div>
            ) : (
              upcomingBookings.map((bk) => (
                <div
                  key={bk.id}
                  className="bg-[#171719] rounded-2xl border border-gold-border/40 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-gold hover:border-gold transition-all"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 rounded-2xl bg-[#0B0B0D] border border-gold/40 flex flex-col items-center justify-center shrink-0 text-gold">
                      <span className="text-[9px] uppercase font-bold tracking-wider">TOKEN</span>
                      <span className="text-2xl font-black">
                        #{bk.queueTokenNumber < 10 ? `0${bk.queueTokenNumber}` : bk.queueTokenNumber}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-base font-bold text-white">{bk.salonName}</h3>
                        <span className="text-[10px] font-mono text-[#71717A]">{bk.bookingCode}</span>
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 uppercase font-bold">
                          {bk.status === "in_service" ? "In Chair" : "Confirmed"}
                        </span>
                      </div>
                      <p className="text-xs text-gold font-medium">
                        {bk.serviceNames.join(" + ")}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-[#A1A1AA] pt-1">
                        <span className="flex items-center">
                          <Calendar className="w-3.5 h-3.5 text-gold mr-1" />
                          {bk.bookingDate} {bk.timeSlot ? `at ${bk.timeSlot}` : "(Walk-In Queue)"}
                        </span>
                        <span>•</span>
                        <span>Barber: {bk.staffName}</span>
                        <span>•</span>
                        <span className="text-white font-bold">₹{bk.totalAmount}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    <Link
                      href="/queue"
                      className="px-4 py-2 rounded-xl bg-gold text-black text-xs font-bold uppercase tracking-wider hover:bg-gold-light transition-all flex items-center space-x-1"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Track Live Queue</span>
                    </Link>
                    <button
                      onClick={() => setCancelModalBooking(bk)}
                      className="px-3 py-2 rounded-xl bg-[#0B0B0D] border border-charcoal-border hover:border-red-500/40 text-xs text-[#A1A1AA] hover:text-red-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: PAST VISITS & HISTORY */}
        {activeTab === "history" && (
          <div className="bg-[#171719] rounded-2xl border border-charcoal-border p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Visit History</h3>
            <div className="space-y-3">
              {pastBookings.map((bk) => (
                <div
                  key={bk.id}
                  className="p-4 rounded-xl bg-[#0B0B0D] border border-charcoal-border flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-bold text-white">{bk.salonName}</h4>
                      <span className="text-[10px] font-mono text-[#71717A]">{bk.bookingCode}</span>
                    </div>
                    <p className="text-xs text-[#A1A1AA]">{bk.serviceNames.join(", ")}</p>
                    <p className="text-[11px] text-[#71717A]">
                      Visited on {bk.bookingDate} with {bk.staffName}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold ${
                        bk.status === "completed"
                          ? "bg-green-500/10 text-green-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {bk.status}
                    </span>
                    <p className="text-xs font-bold text-white mt-1">₹{bk.totalAmount}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: FAVORITE SALONS */}
        {activeTab === "favorites" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {favoriteSalons.map((salon) => (
              <div
                key={salon.id}
                className="bg-[#171719] rounded-2xl border border-charcoal-border p-5 flex items-center space-x-4"
              >
                <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-gold-border/30">
                  <Image src={salon.bannerImage} alt={salon.name} fill className="object-cover" />
                </div>
                <div className="space-y-1 flex-1">
                  <h4 className="text-sm font-bold text-white">{salon.name}</h4>
                  <p className="text-xs text-[#A1A1AA]">{salon.address}</p>
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-xs text-gold font-bold">★ {salon.rating}</span>
                    <Link
                      href={`/book?salonId=${salon.id}`}
                      className="px-3 py-1 rounded-lg bg-gold text-black text-xs font-bold uppercase"
                    >
                      Book Again
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: PROFILE SETTINGS */}
        {activeTab === "profile" && (
          <div className="bg-[#171719] rounded-2xl border border-charcoal-border p-6 space-y-6 max-w-xl">
            <h3 className="text-base font-bold text-white">Client Profile & Preferences</h3>
            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              {profileSaved && (
                <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400">
                  Profile updated successfully!
                </div>
              )}
              <div className="space-y-1">
                <label className="text-[#A1A1AA] font-semibold">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#0B0B0D] border border-charcoal-border rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-gold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#A1A1AA] font-semibold">Phone Number (SMS Queue Alerts)</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#0B0B0D] border border-charcoal-border rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-gold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#A1A1AA] font-semibold">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0B0B0D] border border-charcoal-border rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-gold"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gold text-black font-bold uppercase tracking-wider hover:bg-gold-light transition-all"
              >
                Save Preferences
              </button>
            </form>
          </div>
        )}

        {/* CANCEL MODAL */}
        {cancelModalBooking && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#171719] border border-red-500/40 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
              <h3 className="text-sm font-bold text-white flex items-center">
                <AlertTriangle className="w-4 h-4 text-red-400 mr-2" />
                Cancel Appointment #{cancelModalBooking.queueTokenNumber}?
              </h3>
              <p className="text-xs text-[#A1A1AA]">
                Are you sure you want to cancel your appointment at {cancelModalBooking.salonName}?
              </p>

              <div className="space-y-1 text-xs">
                <label className="text-[#A1A1AA]">Reason</label>
                <select
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  className="w-full bg-[#0B0B0D] border border-charcoal-border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold"
                >
                  <option value="Change of schedule">Change of schedule</option>
                  <option value="Booked by mistake">Booked by mistake</option>
                  <option value="Alternative salon found">Alternative salon found</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  onClick={() => setCancelModalBooking(null)}
                  className="px-4 py-2 text-xs text-[#A1A1AA] hover:text-white"
                >
                  Keep Booking
                </button>
                <button
                  onClick={handleCancelBooking}
                  className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold uppercase hover:bg-red-500"
                >
                  Confirm Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
