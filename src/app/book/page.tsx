"use client";

import { useState, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  Scissors,
  CheckCircle2,
  Calendar,
  Clock,
  User,
  ArrowRight,
  ChevronLeft,
  Sparkles,
  MapPin,
  Star,
  ShieldCheck,
  CreditCard,
  Ticket,
} from "lucide-react";
import { useSalonStore } from "@/lib/store/salonStore";
import { Booking, BookingType, Salon, SalonStaff, ServiceItem } from "@/types";
import { calculateQueueWaitTime } from "@/lib/queue/waitTimeCalculator";

function BookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSalonId = searchParams.get("salonId") || "";
  const initialServiceId = searchParams.get("serviceId") || "";
  const initialType = (searchParams.get("type") as BookingType) || "appointment";

  const { salons, bookings, currentUser, createBooking } = useSalonStore();

  // Booking Form State
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSalonId, setSelectedSalonId] = useState(initialSalonId || salons[0]?.id || "");
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>(
    initialServiceId ? [initialServiceId] : []
  );
  const [selectedStaffId, setSelectedStaffId] = useState<string>("any");
  const [bookingType, setBookingType] = useState<BookingType>(initialType);
  const [bookingDate, setBookingDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [timeSlot, setTimeSlot] = useState<string>("14:30");
  const [customerName, setCustomerName] = useState(currentUser.name || "Alexander Wright");
  const [customerPhone, setCustomerPhone] = useState(currentUser.phone || "+91 98765 43210");
  const [customerEmail, setCustomerEmail] = useState(currentUser.email || "alexander@salonx.luxury");
  const [notes, setNotes] = useState("");

  // Completed booking state
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Selected Salon
  const selectedSalon = useMemo(
    () => salons.find((s) => s.id === selectedSalonId) || salons[0],
    [salons, selectedSalonId]
  );

  // Selected Services objects
  const selectedServices = useMemo(() => {
    if (!selectedSalon) return [];
    return selectedSalon.services.filter((s) => selectedServiceIds.includes(s.id));
  }, [selectedSalon, selectedServiceIds]);

  const totalAmount = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const totalDuration = selectedServices.reduce((sum, s) => sum + s.durationMinutes, 0);

  // Toggle service selection
  const toggleService = (srvId: string) => {
    if (selectedServiceIds.includes(srvId)) {
      if (selectedServiceIds.length > 1) {
        setSelectedServiceIds(selectedServiceIds.filter((id) => id !== srvId));
      }
    } else {
      setSelectedServiceIds([...selectedServiceIds, srvId]);
    }
  };

  // Live estimated wait time calculation preview
  const waitResult = useMemo(() => {
    if (!selectedSalon) return { estimatedWaitMinutes: 20, customersAhead: 0 };
    return calculateQueueWaitTime({
      salon: selectedSalon,
      allBookings: bookings,
      selectedServices,
      preferredStaffId: selectedStaffId,
    });
  }, [selectedSalon, bookings, selectedServices, selectedStaffId]);

  // Handle final confirmation
  const handleConfirmBooking = () => {
    if (selectedServices.length === 0) return;

    const chosenStaff =
      selectedStaffId !== "any"
        ? selectedSalon.staff.find((s) => s.id === selectedStaffId)
        : undefined;

    const newBooking = createBooking({
      salonId: selectedSalon.id,
      salonName: selectedSalon.name,
      salonAddress: selectedSalon.address,
      customerId: currentUser.id,
      customerName,
      customerPhone,
      customerEmail,
      serviceIds: selectedServiceIds,
      serviceNames: selectedServices.map((s) => s.name),
      totalAmount,
      totalDurationMinutes: totalDuration,
      staffId: chosenStaff?.id,
      staffName: chosenStaff?.name || "Any Master Barber",
      bookingType,
      bookingDate,
      timeSlot: bookingType === "appointment" ? timeSlot : undefined,
      notes,
    });

    setConfirmedBooking(newBooking);
    setCurrentStep(6);

    // Confetti
    confetti({
      particleCount: 75,
      spread: 60,
      origin: { y: 0.6 },
      colors: ["#D4AF37", "#FFFFFF", "#BFA15F", "#22C55E"],
    });
  };

  const steps = [
    { num: 1, label: "Salon" },
    { num: 2, label: "Services" },
    { num: 3, label: "Barber" },
    { num: 4, label: "Date & Time" },
    { num: 5, label: "Review & Pay" },
  ];

  return (
    <div className="min-h-screen bg-[#0B0B0D] py-10 pb-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Progress Tracker Bar */}
        {currentStep <= 5 && (
          <div className="mb-10">
            <div className="flex items-center justify-between max-w-2xl mx-auto relative">
              <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/[0.08] -translate-y-1/2 z-0"></div>
              {steps.map((st) => (
                <div key={st.num} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      currentStep === st.num
                        ? "bg-gold text-black shadow-gold ring-4 ring-gold/20"
                        : currentStep > st.num
                        ? "bg-[#22C55E] text-black"
                        : "bg-[#141418] text-[#71717A] border border-white/[0.08]"
                    }`}
                  >
                    {currentStep > st.num ? <CheckCircle2 className="w-5 h-5" /> : st.num}
                  </div>
                  <span
                    className={`text-[10px] mt-2 font-medium uppercase tracking-wider ${
                      currentStep === st.num ? "text-gold font-bold" : "text-[#71717A]"
                    }`}
                  >
                    {st.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 1: SELECT SALON */}
        {currentStep === 1 && (
          <div className="bg-[#141418] rounded-2xl border border-white/[0.08] p-6 sm:p-8 space-y-6 shadow-xl">
            <div>
              <h2 className="text-xl font-bold text-white">Step 1: Choose Luxury Atelier</h2>
              <p className="text-xs text-[#71717A] mt-1">
                Select your preferred salon location and ambiance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {salons
                .filter((s) => s.status === "active")
                .map((salon) => (
                  <div
                    key={salon.id}
                    onClick={() => {
                      setSelectedSalonId(salon.id);
                      setSelectedServiceIds([]);
                    }}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedSalonId === salon.id
                        ? "bg-gold/10 border-gold shadow-gold"
                        : "bg-[#0B0B0D] border-white/[0.08] hover:border-gold/40"
                    }`}
                  >
                    <div className="relative h-28 rounded-lg overflow-hidden mb-3">
                      <Image
                        src={salon.bannerImage}
                        alt={salon.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-[#0B0B0D]/85 border border-white/[0.1] text-[10px] text-gold font-bold flex items-center space-x-1">
                        <Star className="w-3 h-3 text-gold fill-gold" />
                        <span>{salon.rating}</span>
                      </div>
                    </div>
                    <h3 className="text-sm font-bold text-white">{salon.name}</h3>
                    <p className="text-xs text-[#A1A1AA] flex items-center mt-1">
                      <MapPin className="w-3 h-3 text-gold mr-1" />
                      {salon.address}
                    </p>
                    <div className="mt-3 pt-2 border-t border-white/[0.06] flex justify-between items-center text-xs">
                      <span className="text-[#71717A]">Starting ₹{salon.startingPrice}</span>
                      <span className="text-green-400 font-semibold text-[11px]">
                        Queue: #{salon.currentServingToken}
                      </span>
                    </div>
                  </div>
                ))}
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setCurrentStep(2)}
                className="gold-btn px-6 py-3 rounded-xl text-xs uppercase tracking-wider flex items-center space-x-2"
              >
                <span>Select Services</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: SELECT SERVICES */}
        {currentStep === 2 && (
          <div className="bg-[#141418] rounded-2xl border border-white/[0.08] p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Step 2: Select Services</h2>
                <p className="text-xs text-[#71717A] mt-1">
                  Choose one or multiple services for this visit at {selectedSalon.name}.
                </p>
              </div>
              <span className="text-xs text-gold font-semibold">
                {selectedServiceIds.length} Selected
              </span>
            </div>

            <div className="space-y-3">
              {selectedSalon.services.map((service) => {
                const isSelected = selectedServiceIds.includes(service.id);
                return (
                  <div
                    key={service.id}
                    onClick={() => toggleService(service.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? "bg-gold/10 border-gold shadow-gold"
                        : "bg-[#0B0B0D] border-white/[0.08] hover:border-gold/30"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-white">{service.name}</span>
                        {service.popular && (
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-gold/15 text-gold border border-gold/30 uppercase font-bold">
                            Signature
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#A1A1AA]">{service.description}</p>
                      <p className="text-[11px] text-[#71717A] flex items-center">
                        <Clock className="w-3 h-3 text-gold mr-1" />
                        {service.durationMinutes} mins
                      </p>
                    </div>

                    <div className="text-right shrink-0 ml-4">
                      <p className="text-base font-extrabold text-gold">₹{service.price}</p>
                      <div
                        className={`w-5 h-5 rounded-full ml-auto mt-2 flex items-center justify-center border ${
                          isSelected
                            ? "bg-gold border-gold text-black"
                            : "border-white/[0.1] bg-[#141418]"
                        }`}
                      >
                        {isSelected && <CheckCircle2 className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2 text-xs text-[#A1A1AA] hover:text-white"
              >
                Back
              </button>
              <div className="flex items-center space-x-4">
                <div className="text-right text-xs">
                  <span className="text-[#71717A]">Total: </span>
                  <span className="text-gold font-bold text-sm">₹{totalAmount}</span>
                  <span className="text-[#71717A]"> ({totalDuration} mins)</span>
                </div>
                <button
                  disabled={selectedServiceIds.length === 0}
                  onClick={() => setCurrentStep(3)}
                  className="gold-btn px-6 py-3 rounded-xl text-xs uppercase tracking-wider flex items-center space-x-2 disabled:opacity-40"
                >
                  <span>Select Barber</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: PREFERRED BARBER */}
        {currentStep === 3 && (
          <div className="bg-[#141418] rounded-2xl border border-white/[0.08] p-6 sm:p-8 space-y-6 shadow-xl">
            <div>
              <h2 className="text-xl font-bold text-white">Step 3: Preferred Barber or Stylist</h2>
              <p className="text-xs text-[#71717A] mt-1">
                Pick your master craftsman or choose any available barber for fastest turnaround.
              </p>
            </div>

            {/* Any Available Option */}
            <div
              onClick={() => setSelectedStaffId("any")}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                selectedStaffId === "any"
                  ? "bg-gold/10 border-gold shadow-gold"
                  : "bg-[#0B0B0D] border-white/[0.08] hover:border-gold/30"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gold/15 flex items-center justify-center text-gold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">First Available Master Barber</h4>
                  <p className="text-xs text-[#71717A]">
                    Recommended for fastest queue entry and lowest wait time.
                  </p>
                </div>
              </div>
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                  selectedStaffId === "any"
                    ? "bg-gold border-gold text-black"
                    : "border-white/[0.1]"
                }`}
              >
                {selectedStaffId === "any" && <CheckCircle2 className="w-4 h-4" />}
              </div>
            </div>

            {/* Specific Staff Members */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {selectedSalon.staff.map((staff) => (
                <div
                  key={staff.id}
                  onClick={() => setSelectedStaffId(staff.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center space-x-3 ${
                    selectedStaffId === staff.id
                      ? "bg-gold/10 border-gold shadow-gold"
                      : "bg-[#0B0B0D] border-white/[0.08] hover:border-gold/30"
                  }`}
                >
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/[0.08]">
                    <Image
                      src={staff.avatar_url}
                      alt={staff.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="space-y-0.5 flex-1">
                    <h4 className="text-sm font-bold text-white">{staff.name}</h4>
                    <p className="text-xs text-gold">{staff.roleTitle}</p>
                    <p className="text-[10px] text-[#71717A]">Rating: {staff.rating} ({staff.reviewsCount} reviews)</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-4 py-2 text-xs text-[#A1A1AA] hover:text-white"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep(4)}
                className="gold-btn px-6 py-3 rounded-xl text-xs uppercase tracking-wider flex items-center space-x-2"
              >
                <span>Date & Queue Mode</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: DATE & LIVE WALK-IN QUEUE OR APPOINTMENT */}
        {currentStep === 4 && (
          <div className="bg-[#141418] rounded-2xl border border-white/[0.08] p-6 sm:p-8 space-y-6 shadow-xl">
            <div>
              <h2 className="text-xl font-bold text-white">Step 4: Scheduling & Queue Mode</h2>
              <p className="text-xs text-[#71717A] mt-1">
                Choose between joining the immediate live walk-in queue or scheduling a reserved slot.
              </p>
            </div>

            {/* Mode selection buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => {
                  setBookingType("walk_in");
                  setBookingDate(new Date().toISOString().split("T")[0]);
                }}
                className={`p-5 rounded-xl border cursor-pointer transition-all ${
                  bookingType === "walk_in"
                    ? "bg-gold/15 border-gold shadow-gold"
                    : "bg-[#0B0B0D] border-white/[0.08] hover:border-gold/30"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                    <span className="text-xs font-bold uppercase tracking-wider text-green-400">
                      Live Walk-In Queue
                    </span>
                  </div>
                  <Ticket className="w-5 h-5 text-gold" />
                </div>
                <h4 className="text-sm font-bold text-white">Join Today&apos;s Live Queue</h4>
                <p className="text-xs text-[#A1A1AA] mt-1">
                  Get a real-time token right now. Track waiting time dynamically from your phone.
                </p>
                <div className="mt-3 pt-2 border-t border-white/[0.06] text-[11px] text-gold font-semibold">
                  Est. Wait: ~{waitResult.estimatedWaitMinutes} mins ({waitResult.customersAhead} ahead)
                </div>
              </div>

              <div
                onClick={() => setBookingType("appointment")}
                className={`p-5 rounded-xl border cursor-pointer transition-all ${
                  bookingType === "appointment"
                    ? "bg-gold/15 border-gold shadow-gold"
                    : "bg-[#0B0B0D] border-white/[0.08] hover:border-gold/30"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-white">
                    Reserved Slot
                  </span>
                  <Calendar className="w-5 h-5 text-gold" />
                </div>
                <h4 className="text-sm font-bold text-white">Schedule Future Appointment</h4>
                <p className="text-xs text-[#A1A1AA] mt-1">
                  Book a guaranteed time slot for today or an upcoming date of your choice.
                </p>
                <div className="mt-3 pt-2 border-t border-white/[0.06] text-[11px] text-[#71717A]">
                  Reserved chair priority
                </div>
              </div>
            </div>

            {/* Date and Slot picker */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#71717A]">Visit Date</label>
                <input
                  type="date"
                  value={bookingDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full bg-[#0B0B0D] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold"
                />
              </div>

              {bookingType === "appointment" && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#71717A]">Preferred Time Slot</label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full bg-[#0B0B0D] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold"
                  >
                    <option value="10:00">10:00 AM</option>
                    <option value="11:30">11:30 AM</option>
                    <option value="13:00">01:00 PM</option>
                    <option value="14:30">02:30 PM</option>
                    <option value="16:00">04:00 PM</option>
                    <option value="17:30">05:30 PM</option>
                    <option value="19:00">07:00 PM</option>
                  </select>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
              <button
                onClick={() => setCurrentStep(3)}
                className="px-4 py-2 text-xs text-[#A1A1AA] hover:text-white"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep(5)}
                className="gold-btn px-6 py-3 rounded-xl text-xs uppercase tracking-wider flex items-center space-x-2"
              >
                <span>Review & Confirm</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: REVIEW, CUSTOMER INFO & PAYMENT CONFIRMATION */}
        {currentStep === 5 && (
          <div className="bg-[#141418] rounded-2xl border border-white/[0.08] p-6 sm:p-8 space-y-6 shadow-xl">
            <div>
              <h2 className="text-xl font-bold text-white">Step 5: Review & Confirm Booking</h2>
              <p className="text-xs text-[#71717A] mt-1">
                Verify your contact details and service summary before token generation.
              </p>
            </div>

            {/* Client info inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] text-[#71717A] font-semibold">Your Full Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-[#0B0B0D] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-[#71717A] font-semibold">Phone (SMS Alerts)</label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-[#0B0B0D] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-[#71717A] font-semibold">Email</label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full bg-[#0B0B0D] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold"
                  required
                />
              </div>
            </div>

            {/* Summary Card */}
            <div className="p-5 rounded-xl bg-[#0B0B0D] border border-white/[0.06] space-y-3">
              <div className="flex justify-between items-start pb-3 border-b border-white/[0.06]">
                <div>
                  <h4 className="text-sm font-bold text-white">{selectedSalon.name}</h4>
                  <p className="text-xs text-[#A1A1AA]">{selectedSalon.address}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs px-2 py-0.5 rounded bg-gold/15 text-gold border border-gold/30 font-semibold uppercase">
                    {bookingType === "walk_in" ? "Walk-In Queue" : "Reserved Slot"}
                  </span>
                  <p className="text-xs text-[#71717A] mt-1">
                    {bookingDate} {bookingType === "appointment" ? `• ${timeSlot}` : ""}
                  </p>
                </div>
              </div>

              {/* Chosen Services */}
              <div className="space-y-2 text-xs">
                {selectedServices.map((srv) => (
                  <div key={srv.id} className="flex justify-between text-[#A1A1AA]">
                    <span>{srv.name} ({srv.durationMinutes} mins)</span>
                    <span className="text-white font-medium">₹{srv.price}</span>
                  </div>
                ))}
              </div>

              {/* Total Row */}
              <div className="pt-3 border-t border-white/[0.06] flex justify-between items-center text-sm">
                <span className="font-bold text-white">Total Payable Amount</span>
                <span className="text-xl font-black text-gold">₹{totalAmount}</span>
              </div>
            </div>

            {/* Payment method */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#71717A]">Payment Preference</label>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#0B0B0D] border border-gold flex items-center space-x-2 text-white font-medium">
                  <CreditCard className="w-4 h-4 text-gold" />
                  <span>Pay at Salon (Cash / UPI / Card)</span>
                </div>
                <div className="p-3 rounded-xl bg-[#0B0B0D] border border-white/[0.08] flex items-center space-x-2 text-[#71717A]">
                  <Sparkles className="w-4 h-4" />
                  <span>Online Prepaid</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
              <button
                onClick={() => setCurrentStep(4)}
                className="px-4 py-2 text-xs text-[#A1A1AA] hover:text-white"
              >
                Back
              </button>
              <button
                onClick={handleConfirmBooking}
                className="gold-btn px-8 py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-gold"
              >
                Confirm & Generate Token
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: CONFIRMATION SUCCESS WITH LIVE TOKEN CARD */}
        {currentStep === 6 && confirmedBooking && (
          <div className="bg-[#141418] rounded-2xl border border-white/[0.1] p-6 sm:p-10 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center mx-auto text-gold">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-xs uppercase tracking-[0.25em] text-gold font-bold">
                Booking Confirmed
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Queue Token Generated Successfully
              </h2>
              <p className="text-xs text-[#71717A]">
                Your booking ID is <span className="text-white font-mono font-bold">{confirmedBooking.bookingCode}</span>
              </p>
            </div>

            {/* Live Token Pass */}
            <div className="max-w-md mx-auto bg-[#0B0B0D] rounded-2xl border border-gold/40 p-6 relative overflow-hidden shadow-2xl text-left">
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                <div>
                  <p className="text-[10px] text-gold uppercase tracking-wider font-bold">Digital Boarding Pass</p>
                  <h4 className="text-base font-bold text-white">{confirmedBooking.salonName}</h4>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gold/15 flex flex-col items-center justify-center text-gold">
                  <Ticket className="w-6 h-6" />
                </div>
              </div>

              {/* Big Token Number */}
              <div className="py-6 text-center bg-gradient-to-b from-transparent via-gold/5 to-transparent rounded-xl my-2">
                <p className="text-xs text-[#71717A] uppercase tracking-wider font-semibold">
                  Official Token Number
                </p>
                <p className="text-6xl font-black text-gold tracking-tight mt-1">
                  #{confirmedBooking.queueTokenNumber < 10 ? `0${confirmedBooking.queueTokenNumber}` : confirmedBooking.queueTokenNumber}
                </p>
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 text-xs font-semibold mt-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <span>Active in Live Queue</span>
                </div>
              </div>

              {/* Details table */}
              <div className="space-y-2 text-xs border-t border-white/[0.08] pt-4">
                <div className="flex justify-between text-[#A1A1AA]">
                  <span>Customer:</span>
                  <span className="text-white font-medium">{confirmedBooking.customerName}</span>
                </div>
                <div className="flex justify-between text-[#A1A1AA]">
                  <span>Services:</span>
                  <span className="text-white font-medium text-right max-w-[200px] truncate">
                    {confirmedBooking.serviceNames.join(", ")}
                  </span>
                </div>
                <div className="flex justify-between text-[#A1A1AA]">
                  <span>Assigned Barber:</span>
                  <span className="text-gold font-medium">{confirmedBooking.staffName}</span>
                </div>
                <div className="flex justify-between text-[#A1A1AA]">
                  <span>Estimated Wait:</span>
                  <span className="text-white font-bold">~{confirmedBooking.estimatedWaitMinutes} minutes</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/queue"
                className="gold-btn w-full sm:w-auto px-8 py-3 rounded-xl text-xs uppercase tracking-wider shadow-gold"
              >
                Track Live Queue Now
              </Link>
              <Link
                href="/customer"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#0B0B0D] text-white border border-white/[0.1] hover:border-gold text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                View in My Bookings
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0B0B0D] p-8 text-gold">Loading booking studio...</div>}>
      <BookingContent />
    </Suspense>
  );
}
