"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Clock,
  Ticket,
  Scissors,
  Users,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Bell,
  Sparkles,
  MapPin,
  Play,
  RotateCcw,
  Check,
} from "lucide-react";
import { useSalonStore } from "@/lib/store/salonStore";
import { calculateQueueWaitTime } from "@/lib/queue/waitTimeCalculator";

export default function LiveQueuePage() {
  const { salons, bookings, currentUser, updateBookingStatus } = useSalonStore();

  // Find user's active bookings
  const userActiveBookings = useMemo(() => {
    return bookings.filter(
      (b) =>
        (b.customerId === currentUser.id || b.customerPhone === currentUser.phone) &&
        (b.status === "confirmed" || b.status === "in_service")
    );
  }, [bookings, currentUser]);

  // Selected booking to track (defaults to user's first active or demo booking #12)
  const defaultBooking =
    userActiveBookings[0] ||
    bookings.find((b) => b.queueTokenNumber === 12) ||
    bookings[0];

  const [selectedBookingId, setSelectedBookingId] = useState<string>(
    defaultBooking?.id || ""
  );
  const [searchCodeInput, setSearchCodeInput] = useState("");
  const [notificationTurnOn, setNotificationTurnOn] = useState(false);

  // Update selected booking if default changes
  useEffect(() => {
    if (!selectedBookingId && defaultBooking) {
      setSelectedBookingId(defaultBooking.id);
    }
  }, [defaultBooking, selectedBookingId]);

  const activeBooking = bookings.find((b) => b.id === selectedBookingId) || defaultBooking;

  const activeSalon = useMemo(() => {
    if (!activeBooking) return salons[0];
    return salons.find((s) => s.id === activeBooking.salonId) || salons[0];
  }, [salons, activeBooking]);

  // Compute live dynamic wait time and customers ahead using the real calculation engine
  const queueStats = useMemo(() => {
    if (!activeSalon || !activeBooking) {
      return {
        estimatedWaitMinutes: 25,
        customersAhead: 3,
        activeBarbersCount: 3,
        confidenceScore: "High" as const,
        explanation: "Normal floor throughput",
      };
    }

    return calculateQueueWaitTime({
      salon: activeSalon,
      allBookings: bookings,
      targetBookingId: activeBooking.id,
      preferredStaffId: activeBooking.staffId,
    });
  }, [activeSalon, activeBooking, bookings]);

  // Now serving token for this salon
  const nowServingToken = activeSalon?.currentServingToken || 9;
  const yourToken = activeBooking?.queueTokenNumber || 12;
  const customersAhead = Math.max(0, queueStats.customersAhead);
  const estimatedWaitMinutes =
    activeBooking?.status === "in_service" ? 0 : queueStats.estimatedWaitMinutes;

  // Search booking by code
  const handleSearchCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCodeInput.trim()) return;
    const found = bookings.find(
      (b) =>
        b.bookingCode.toLowerCase() === searchCodeInput.trim().toLowerCase() ||
        b.customerPhone.includes(searchCodeInput.trim())
    );
    if (found) {
      setSelectedBookingId(found.id);
      setSearchCodeInput("");
    } else {
      alert("No active booking found for that code or phone number.");
    }
  };

  // Live simulation: advance queue
  const handleSimulateAdvance = () => {
    if (!activeSalon) return;
    const inService = bookings.find(
      (b) => b.salonId === activeSalon.id && b.status === "in_service"
    );
    if (inService) {
      updateBookingStatus(inService.id, "completed");
    }

    const nextInLine = bookings
      .filter((b) => b.salonId === activeSalon.id && b.status === "confirmed")
      .sort((a, b) => a.queueTokenNumber - b.queueTokenNumber)[0];

    if (nextInLine) {
      updateBookingStatus(nextInLine.id, "in_service");
    }
  };

  // Progress percentage
  const progressPercent =
    activeBooking?.status === "in_service"
      ? 100
      : activeBooking?.status === "completed"
      ? 100
      : Math.min(100, Math.max(10, Math.round((1 - customersAhead / (customersAhead + 3)) * 100)));

  return (
    <div className="min-h-screen bg-[#08080B] py-10 pb-28 text-[#F4F4F5]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-gold/15 text-gold border border-gold/30 text-xs font-semibold mb-2 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-gold mr-2 animate-ping" />
              <span>Live Queue Monitor</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Live Queue Tracker
            </h1>
            <p className="text-xs text-[#71717A] mt-1 font-normal">
              Real-time monitoring for your salon visit with zero lobby waiting.
            </p>
          </div>

          {/* Quick Code Lookup Form */}
          <form onSubmit={handleSearchCode} className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Enter Code (e.g. SX-7112)"
              value={searchCodeInput}
              onChange={(e) => setSearchCodeInput(e.target.value)}
              className="bg-[#121217] border border-white/[0.1] rounded-xl px-3.5 py-2 text-xs text-white placeholder-[#71717A] focus:outline-none focus:border-gold transition-colors"
            />
            <button
              type="submit"
              className="gold-btn px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-bold"
            >
              Track
            </button>
          </form>
        </div>

        {/* ACTIVE BOOKINGS SELECTOR (If user has multiple) */}
        {userActiveBookings.length > 1 && (
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            <span className="text-xs text-[#71717A] shrink-0 font-medium">Your Active Passes:</span>
            {userActiveBookings.map((b) => (
              <button
                key={b.id}
                onClick={() => setSelectedBookingId(b.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border shrink-0 transition-all ${
                  selectedBookingId === b.id
                    ? "bg-gold text-black border-gold font-bold shadow-gold"
                    : "bg-[#121217] text-[#A1A1AA] border-white/[0.08] hover:text-white"
                }`}
              >
                Token #{b.queueTokenNumber} • {b.salonName}
              </button>
            ))}
          </div>
        )}

        {/* MAIN LIVE QUEUE DISPLAY CARD */}
        {activeBooking ? (
          <div className="relative">
            <div className="bg-[#121217]/95 rounded-3xl border border-white/[0.1] p-6 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.85)] backdrop-blur-2xl space-y-8">
              {/* Top Atelier info bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/[0.08] gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs uppercase font-semibold text-gold tracking-wider">
                      Digital Boarding Pass
                    </span>
                    <span className="text-[#71717A]">•</span>
                    <span className="text-xs font-mono text-white bg-white/[0.06] px-2 py-0.5 rounded-md">
                      ID: {activeBooking.bookingCode}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    {activeBooking.salonName}
                  </h2>
                  <p className="text-xs text-[#A1A1AA] flex items-center">
                    <MapPin className="w-3.5 h-3.5 text-gold mr-1.5" />
                    {activeBooking.salonAddress}
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setNotificationTurnOn(!notificationTurnOn)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 border transition-all ${
                      notificationTurnOn
                        ? "bg-green-500/15 border-green-500/40 text-green-400 shadow-[0_0_15px_rgba(74,222,128,0.2)]"
                        : "bg-[#08080B] border-white/[0.08] text-[#A1A1AA] hover:text-white"
                    }`}
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span>{notificationTurnOn ? "SMS Alert Active" : "Get SMS Alert"}</span>
                  </button>
                </div>
              </div>

              {/* CORE METRICS GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* YOUR TOKEN */}
                <div className="bg-[#08080B] p-5 rounded-2xl border border-gold/50 text-center relative overflow-hidden shadow-gold">
                  <div className="absolute top-0 right-0 w-8 h-8 bg-gold/15 rounded-bl-xl flex items-center justify-center">
                    <Ticket className="w-4 h-4 text-gold" />
                  </div>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-gold">
                    YOUR TOKEN
                  </p>
                  <p className="text-5xl font-black text-gold mt-2">
                    #{yourToken < 10 ? `0${yourToken}` : yourToken}
                  </p>
                  <p className="text-[10px] text-[#71717A] mt-2 font-medium">
                    {activeBooking.customerName}
                  </p>
                </div>

                {/* NOW SERVING */}
                <div className="bg-[#08080B] p-5 rounded-2xl border border-white/[0.08] text-center">
                  <p className="text-[10px] uppercase tracking-wider font-semibold text-[#71717A]">
                    NOW SERVING
                  </p>
                  <p className="text-5xl font-black text-white mt-2">
                    #{nowServingToken < 10 ? `0${nowServingToken}` : nowServingToken}
                  </p>
                  <span className="inline-block mt-2 text-[10px] px-2.5 py-0.5 rounded-full bg-green-500/10 text-green-400 font-semibold border border-green-500/20">
                    Chair Active
                  </span>
                </div>

                {/* CUSTOMERS AHEAD */}
                <div className="bg-[#08080B] p-5 rounded-2xl border border-white/[0.08] text-center">
                  <p className="text-[10px] uppercase tracking-wider font-semibold text-[#71717A]">
                    CUSTOMERS AHEAD
                  </p>
                  <p className="text-5xl font-black text-white mt-2">
                    {activeBooking.status === "in_service" ? "0" : customersAhead}
                  </p>
                  <p className="text-[10px] text-[#71717A] mt-2 font-medium">
                    {customersAhead === 0 ? "You're Next in Chair!" : "Moving Steadily"}
                  </p>
                </div>

                {/* ESTIMATED WAITING TIME */}
                <div className="bg-[#08080B] p-5 rounded-2xl border border-white/[0.08] text-center">
                  <p className="text-[10px] uppercase tracking-wider font-semibold text-[#71717A]">
                    ESTIMATED WAIT
                  </p>
                  <p className="text-5xl font-black text-white mt-2">
                    {activeBooking.status === "in_service" ? "0" : estimatedWaitMinutes}
                    <span className="text-sm font-normal text-[#71717A] ml-1">MIN</span>
                  </p>
                  <p className="text-[10px] text-gold mt-2 font-medium">
                    {queueStats.explanation}
                  </p>
                </div>
              </div>

              {/* 4-STAGE QUEUE PROGRESSION STEPS */}
              <div className="bg-[#08080B] rounded-2xl p-5 border border-white/[0.08] space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#71717A] font-semibold uppercase tracking-wider text-[10px]">
                    Live Seating Progression
                  </span>
                  <span className="text-gold font-bold">{progressPercent}% Ready</span>
                </div>

                {/* Multi-step track */}
                <div className="grid grid-cols-4 gap-2.5 text-center text-xs">
                  <div className="space-y-1.5">
                    <div className="h-2 rounded-full bg-gold shadow-[0_0_8px_#D4AF37]" />
                    <p className="text-[10px] text-white font-medium">1. Registered</p>
                  </div>
                  <div className="space-y-1.5">
                    <div className={`h-2 rounded-full transition-all ${customersAhead <= 2 ? "bg-gold shadow-[0_0_8px_#D4AF37]" : "bg-white/[0.08]"}`} />
                    <p className="text-[10px] text-[#A1A1AA]">2. In Line</p>
                  </div>
                  <div className="space-y-1.5">
                    <div className={`h-2 rounded-full transition-all ${customersAhead === 0 || activeBooking.status === "in_service" ? "bg-gold shadow-[0_0_8px_#D4AF37]" : "bg-white/[0.08]"}`} />
                    <p className="text-[10px] text-[#A1A1AA]">3. Next Up</p>
                  </div>
                  <div className="space-y-1.5">
                    <div className={`h-2 rounded-full transition-all ${activeBooking.status === "in_service" ? "bg-green-500 shadow-[0_0_8px_#22c55e]" : "bg-white/[0.08]"}`} />
                    <p className="text-[10px] text-[#A1A1AA]">4. Seated in Chair</p>
                  </div>
                </div>
              </div>

              {/* Service & Visit Breakdown */}
              <div className="p-5 rounded-2xl bg-[#08080B] border border-white/[0.08] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-[#71717A] uppercase text-[10px] font-semibold tracking-wider">
                    Requested Services
                  </span>
                  <p className="text-white font-bold mt-1">
                    {activeBooking.serviceNames.join(" + ")}
                  </p>
                </div>
                <div>
                  <span className="text-[#71717A] uppercase text-[10px] font-semibold tracking-wider">
                    Expected Duration
                  </span>
                  <p className="text-white font-bold mt-1">
                    {activeBooking.totalDurationMinutes} minutes
                  </p>
                </div>
                <div>
                  <span className="text-[#71717A] uppercase text-[10px] font-semibold tracking-wider">
                    Total Amount
                  </span>
                  <p className="text-gold font-black text-sm mt-1">
                    ₹{activeBooking.totalAmount}
                  </p>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="flex items-start space-x-2.5 p-3.5 rounded-xl bg-gold/5 border border-gold/20 text-[#A1A1AA] text-xs">
                <AlertCircle className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <p className="leading-relaxed text-[11px]">
                  Waiting times are calculated dynamically based on active barber throughput and requested services. Actual seating times may adjust slightly.
                </p>
              </div>

              {/* SIMULATION BAR */}
              <div className="pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-[#71717A] flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-gold" />
                  <span>Interactive Test: Advance floor chair progression</span>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleSimulateAdvance}
                    className="px-4 py-2 rounded-xl bg-[#08080B] border border-gold text-gold hover:bg-gold/10 text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-sm"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Advance Queue (Simulate)</span>
                  </button>
                  <Link
                    href="/owner"
                    className="gold-btn px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-bold"
                  >
                    Open Owner Dashboard
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#121217] rounded-3xl border border-white/[0.08] p-12 text-center space-y-4">
            <Ticket className="w-12 h-12 text-[#71717A] mx-auto" />
            <h3 className="text-lg font-bold text-white">No active queue token found</h3>
            <p className="text-xs text-[#71717A] max-w-sm mx-auto">
              Join a live walk-in queue or book an appointment at any luxury salon to get an immediate token pass.
            </p>
            <Link
              href="/book"
              className="gold-btn inline-block px-6 py-3 rounded-xl text-xs uppercase tracking-wider font-bold"
            >
              Book / Join Queue
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
