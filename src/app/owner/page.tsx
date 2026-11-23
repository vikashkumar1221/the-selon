"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Store,
  Clock,
  CheckCircle2,
  XCircle,
  Play,
  UserPlus,
  Users,
  DollarSign,
  Scissors,
  Settings,
  Plus,
  AlertTriangle,
  Calendar,
  Sparkles,
  Search,
  Check,
  ChevronRight,
  X,
} from "lucide-react";
import { useSalonStore } from "@/lib/store/salonStore";
import { Booking, BookingStatus, ServiceItem, SalonStaff } from "@/types";

export default function SalonOwnerDashboard() {
  const { salons, bookings, currentUser, updateBookingStatus, updateSalon, createBooking } =
    useSalonStore();

  // Find owner's salon (default to The Royal Crown Barber)
  const salon =
    salons.find((s) => s.ownerId === currentUser.id || s.id === currentUser.salon_id) ||
    salons[0];

  const [activeTab, setActiveTab] = useState<"queue" | "bookings" | "services" | "staff" | "settings">("queue");
  const [cancelModalBooking, setCancelModalBooking] = useState<Booking | null>(null);
  const [cancellationReason, setCancellationReason] = useState("Customer no-show");
  const [walkinModalOpen, setWalkinModalOpen] = useState(false);

  // Walk-in form state
  const [walkinName, setWalkinName] = useState("");
  const [walkinPhone, setWalkinPhone] = useState("");
  const [walkinServiceId, setWalkinServiceId] = useState(salon.services[0]?.id || "");
  const [walkinStaffId, setWalkinStaffId] = useState("any");

  // Salon settings edit state
  const [salonName, setSalonName] = useState(salon.name);
  const [salonTagline, setSalonTagline] = useState(salon.tagline);
  const [salonPhone, setSalonPhone] = useState(salon.phone);
  const [salonAddress, setSalonAddress] = useState(salon.address);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Filter today's bookings for this salon
  const todayStr = new Date().toISOString().split("T")[0];
  const salonBookings = useMemo(() => {
    return bookings.filter((b) => b.salonId === salon.id);
  }, [bookings, salon.id]);

  const activeQueue = useMemo(() => {
    return salonBookings
      .filter((b) => b.status === "confirmed" || b.status === "in_service")
      .sort((a, b) => a.queueTokenNumber - b.queueTokenNumber);
  }, [salonBookings]);

  const completedToday = salonBookings.filter(
    (b) => b.status === "completed" && b.bookingDate === todayStr
  );
  const cancelledToday = salonBookings.filter(
    (b) => b.status === "cancelled" && b.bookingDate === todayStr
  );
  const todayRevenue = salonBookings
    .filter((b) => b.status === "completed")
    .reduce((sum, b) => sum + b.totalAmount, 0);

  // Handlers for Queue
  const handleStartService = (bookingId: string) => {
    updateBookingStatus(bookingId, "in_service");
  };

  const handleCompleteService = (bookingId: string) => {
    updateBookingStatus(bookingId, "completed");
  };

  const handleConfirmCancel = () => {
    if (!cancelModalBooking) return;
    updateBookingStatus(cancelModalBooking.id, "cancelled", cancellationReason);
    setCancelModalBooking(null);
  };

  const handleAddWalkin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkinName.trim()) return;

    const srv = salon.services.find((s) => s.id === walkinServiceId) || salon.services[0];
    const staff = walkinStaffId !== "any" ? salon.staff.find((s) => s.id === walkinStaffId) : undefined;

    createBooking({
      salonId: salon.id,
      salonName: salon.name,
      salonAddress: salon.address,
      customerId: `walkin_${Date.now()}`,
      customerName: walkinName,
      customerPhone: walkinPhone || "+91 99999 00000",
      customerEmail: "walkin@guest.com",
      serviceIds: [srv.id],
      serviceNames: [srv.name],
      totalAmount: srv.price,
      totalDurationMinutes: srv.durationMinutes,
      staffId: staff?.id,
      staffName: staff?.name || "Any Master Barber",
      bookingType: "walk_in",
      bookingDate: todayStr,
      notes: "Walk-in entry at front desk",
    });

    setWalkinName("");
    setWalkinPhone("");
    setWalkinModalOpen(false);
  };

  const handleSaveSalonSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSalon(salon.id, {
      name: salonName,
      tagline: salonTagline,
      phone: salonPhone,
      address: salonAddress,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const toggleStaffAvailability = (staffId: string) => {
    const updatedStaff = salon.staff.map((st) =>
      st.id === staffId ? { ...st, isAvailable: !st.isAvailable } : st
    );
    updateSalon(salon.id, { staff: updatedStaff });
  };

  return (
    <div className="min-h-screen bg-[#0B0B0D] py-10 pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* TOP BAR: SALON BRAND & QUICK ACTIONS */}
        <div className="bg-[#171719] rounded-2xl border border-charcoal-border p-6 shadow-luxury flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-gold-border/40 shrink-0">
              <Image src={salon.bannerImage} alt={salon.name} fill className="object-cover" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] uppercase tracking-wider text-gold font-bold">
                  Owner Dashboard
                </span>
                <span className="text-[#71717A]">•</span>
                <span className="text-xs text-green-400 font-semibold">Live Mode</span>
              </div>
              <h1 className="text-2xl font-extrabold text-white">{salon.name}</h1>
              <p className="text-xs text-[#A1A1AA]">{salon.address}, {salon.city}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setWalkinModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-gold text-black text-xs font-bold uppercase tracking-wider hover:bg-gold-light transition-all flex items-center space-x-1.5 shadow-gold"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Walk-In Client</span>
            </button>
            <Link
              href={`/salons/${salon.id}`}
              className="px-4 py-2.5 rounded-xl bg-[#0B0B0D] text-white border border-charcoal-border hover:border-gold text-xs font-semibold transition-colors"
            >
              View Public Page
            </Link>
          </div>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
          <div className="bg-[#171719] p-4 rounded-xl border border-charcoal-border">
            <p className="text-[10px] uppercase tracking-wider text-[#A1A1AA] font-semibold">Total Today</p>
            <p className="text-2xl font-extrabold text-white mt-1">{salonBookings.length}</p>
            <p className="text-[10px] text-[#71717A] mt-1">Appointments & Walk-ins</p>
          </div>

          <div className="bg-[#171719] p-4 rounded-xl border border-gold/40 shadow-gold">
            <p className="text-[10px] uppercase tracking-wider text-gold font-semibold">Active Queue</p>
            <p className="text-2xl font-extrabold text-gold mt-1">{activeQueue.length}</p>
            <p className="text-[10px] text-[#A1A1AA] mt-1">Waiting & In-Chair</p>
          </div>

          <div className="bg-[#171719] p-4 rounded-xl border border-charcoal-border">
            <p className="text-[10px] uppercase tracking-wider text-[#A1A1AA] font-semibold">Serving Token</p>
            <p className="text-2xl font-extrabold text-green-400 mt-1">#{salon.currentServingToken}</p>
            <p className="text-[10px] text-[#71717A] mt-1">Current Chair</p>
          </div>

          <div className="bg-[#171719] p-4 rounded-xl border border-charcoal-border">
            <p className="text-[10px] uppercase tracking-wider text-[#A1A1AA] font-semibold">Completed</p>
            <p className="text-2xl font-extrabold text-white mt-1">{completedToday.length}</p>
            <p className="text-[10px] text-green-400 mt-1">100% Satisfied</p>
          </div>

          <div className="bg-[#171719] p-4 rounded-xl border border-charcoal-border">
            <p className="text-[10px] uppercase tracking-wider text-[#A1A1AA] font-semibold">Cancelled / Skip</p>
            <p className="text-2xl font-extrabold text-[#71717A] mt-1">{cancelledToday.length}</p>
            <p className="text-[10px] text-[#71717A] mt-1">With logged reasons</p>
          </div>

          <div className="bg-[#171719] p-4 rounded-xl border border-charcoal-border">
            <p className="text-[10px] uppercase tracking-wider text-gold font-semibold">Today Revenue</p>
            <p className="text-2xl font-extrabold text-white mt-1">₹{todayRevenue}</p>
            <p className="text-[10px] text-gold mt-1">Platform Settlement</p>
          </div>
        </div>

        {/* TABS NAVIGATION */}
        <div className="flex space-x-2 border-b border-charcoal-border/70 pb-2 overflow-x-auto">
          {[
            { id: "queue", label: "Live Queue Management", icon: Clock },
            { id: "bookings", label: "All Bookings & History", icon: Calendar },
            { id: "services", label: "Services & Pricing", icon: Scissors },
            { id: "staff", label: "Staff & Barbers", icon: Users },
            { id: "settings", label: "Salon Profile Settings", icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
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
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.id === "queue" && activeQueue.length > 0 && (
                  <span
                    className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive ? "bg-black text-gold font-bold" : "bg-gold/20 text-gold"
                    }`}
                  >
                    {activeQueue.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: LIVE QUEUE MANAGEMENT CONTROLLER */}
        {activeTab === "queue" && (
          <div className="bg-[#171719] rounded-2xl border border-charcoal-border p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-charcoal-border/50 gap-2">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center">
                  <Clock className="w-5 h-5 text-gold mr-2" />
                  Real-Time Floor Queue
                </h3>
                <p className="text-xs text-[#A1A1AA]">
                  Advancing or skipping tokens broadcasts live updates immediately to customer devices.
                </p>
              </div>
              <div className="text-xs text-gold font-semibold">
                Currently Serving: #{salon.currentServingToken}
              </div>
            </div>

            {activeQueue.length === 0 ? (
              <div className="p-12 text-center text-xs text-[#71717A] space-y-2">
                <CheckCircle2 className="w-10 h-10 text-gold/40 mx-auto" />
                <p className="text-white font-semibold">The chair queue is currently clear</p>
                <p>New appointments and walk-in tickets will show up here automatically.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activeQueue.map((item, index) => {
                  const isInChair = item.status === "in_service";
                  return (
                    <div
                      key={item.id}
                      className={`p-5 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                        isInChair
                          ? "bg-green-500/10 border-green-500/50 shadow-gold"
                          : "bg-[#0B0B0D] border-charcoal-border hover:border-gold/30"
                      }`}
                    >
                      {/* Left: Token info */}
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center font-black ${
                            isInChair
                              ? "bg-green-500 text-black shadow-lg"
                              : "bg-[#171719] text-gold border border-gold/40"
                          }`}
                        >
                          <span className="text-[10px] uppercase font-bold tracking-wider leading-none">
                            TOKEN
                          </span>
                          <span className="text-xl leading-tight">
                            #{item.queueTokenNumber < 10 ? `0${item.queueTokenNumber}` : item.queueTokenNumber}
                          </span>
                        </div>

                        <div className="space-y-0.5">
                          <div className="flex items-center space-x-2">
                            <h4 className="text-sm font-bold text-white">{item.customerName}</h4>
                            <span className="text-[10px] font-mono text-[#71717A]">
                              {item.bookingCode}
                            </span>
                            <span
                              className={`text-[9px] px-2 py-0.5 rounded-full uppercase font-bold ${
                                isInChair
                                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                  : "bg-gold/15 text-gold border border-gold/30"
                              }`}
                            >
                              {isInChair ? "In Chair" : "Waiting"}
                            </span>
                          </div>
                          <p className="text-xs text-[#A1A1AA]">
                            {item.serviceNames.join(", ")} • {item.totalDurationMinutes} mins
                          </p>
                          <div className="flex items-center space-x-3 text-[11px] text-[#71717A]">
                            <span>Barber: {item.staffName}</span>
                            <span>•</span>
                            <span>Phone: {item.customerPhone}</span>
                            <span>•</span>
                            <span>Est: ~{item.estimatedWaitMinutes} mins</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center space-x-2 shrink-0">
                        {!isInChair ? (
                          <button
                            onClick={() => handleStartService(item.id)}
                            className="px-4 py-2 rounded-xl bg-gold text-black text-xs font-bold uppercase tracking-wider hover:bg-gold-light transition-all flex items-center space-x-1"
                          >
                            <Play className="w-3.5 h-3.5 fill-black" />
                            <span>Start Service</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleCompleteService(item.id)}
                            className="px-4 py-2 rounded-xl bg-green-500 text-black text-xs font-bold uppercase tracking-wider hover:bg-green-400 transition-all flex items-center space-x-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Mark Completed</span>
                          </button>
                        )}

                        <button
                          onClick={() => setCancelModalBooking(item)}
                          className="px-3 py-2 rounded-xl bg-[#171719] border border-charcoal-border hover:border-red-500/50 text-xs text-[#A1A1AA] hover:text-red-400 transition-colors"
                          title="Skip or cancel token"
                        >
                          Skip / Cancel
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: BOOKINGS & AUDIT HISTORY */}
        {activeTab === "bookings" && (
          <div className="bg-[#171719] rounded-2xl border border-charcoal-border p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Full Booking Archive</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-charcoal-border/80 text-[#71717A] uppercase">
                    <th className="py-3 px-3">Token</th>
                    <th className="py-3 px-3">Code</th>
                    <th className="py-3 px-3">Customer</th>
                    <th className="py-3 px-3">Service</th>
                    <th className="py-3 px-3">Barber</th>
                    <th className="py-3 px-3">Amount</th>
                    <th className="py-3 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-charcoal-border/40">
                  {salonBookings.map((bk) => (
                    <tr key={bk.id} className="hover:bg-[#0B0B0D]/50 text-[#A1A1AA]">
                      <td className="py-3 px-3 font-bold text-gold">#{bk.queueTokenNumber}</td>
                      <td className="py-3 px-3 font-mono text-white">{bk.bookingCode}</td>
                      <td className="py-3 px-3 text-white font-medium">{bk.customerName}</td>
                      <td className="py-3 px-3">{bk.serviceNames[0]}</td>
                      <td className="py-3 px-3">{bk.staffName}</td>
                      <td className="py-3 px-3 font-semibold text-white">₹{bk.totalAmount}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            bk.status === "completed"
                              ? "bg-green-500/10 text-green-400"
                              : bk.status === "in_service"
                              ? "bg-blue-500/10 text-blue-400"
                              : bk.status === "cancelled"
                              ? "bg-red-500/10 text-red-400"
                              : "bg-gold/10 text-gold"
                          }`}
                        >
                          {bk.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: SERVICES & PRICING */}
        {activeTab === "services" && (
          <div className="bg-[#171719] rounded-2xl border border-charcoal-border p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-charcoal-border/50">
              <h3 className="text-lg font-bold text-white">Services Catalog & Durations</h3>
              <span className="text-xs text-[#A1A1AA]">{salon.services.length} Total Services</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {salon.services.map((srv) => (
                <div
                  key={srv.id}
                  className="p-4 rounded-xl bg-[#0B0B0D] border border-charcoal-border flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-white">{srv.name}</h4>
                    <p className="text-xs text-[#A1A1AA]">{srv.description}</p>
                    <span className="text-[10px] text-gold font-medium">
                      Duration: {srv.durationMinutes} minutes
                    </span>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-base font-extrabold text-gold">₹{srv.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: STAFF & BARBERS AVAILABILITY */}
        {activeTab === "staff" && (
          <div className="bg-[#171719] rounded-2xl border border-charcoal-border p-6 space-y-6">
            <h3 className="text-lg font-bold text-white">Master Barbers & Chair Status</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {salon.staff.map((st) => (
                <div
                  key={st.id}
                  className="p-5 rounded-xl bg-[#0B0B0D] border border-charcoal-border space-y-3"
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-gold-border/30">
                      <Image src={st.avatar_url} alt={st.name} fill className="object-cover" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{st.name}</h4>
                      <p className="text-xs text-gold">{st.roleTitle}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-charcoal-border/50 flex items-center justify-between">
                    <span className="text-xs text-[#A1A1AA]">On Floor Duty:</span>
                    <button
                      onClick={() => toggleStaffAvailability(st.id)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                        st.isAvailable
                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                          : "bg-red-500/20 text-red-400 border border-red-500/30"
                      }`}
                    >
                      {st.isAvailable ? "Available" : "On Break"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: SALON PROFILE SETTINGS */}
        {activeTab === "settings" && (
          <div className="bg-[#171719] rounded-2xl border border-charcoal-border p-6 space-y-6">
            <h3 className="text-lg font-bold text-white">Atelier Business Settings</h3>
            <form onSubmit={handleSaveSalonSettings} className="space-y-4 max-w-xl">
              {saveSuccess && (
                <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-xs">
                  Salon profile changes saved successfully!
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#A1A1AA]">Salon Name</label>
                <input
                  type="text"
                  value={salonName}
                  onChange={(e) => setSalonName(e.target.value)}
                  className="w-full bg-[#0B0B0D] border border-charcoal-border rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-gold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#A1A1AA]">Brand Tagline</label>
                <input
                  type="text"
                  value={salonTagline}
                  onChange={(e) => setSalonTagline(e.target.value)}
                  className="w-full bg-[#0B0B0D] border border-charcoal-border rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-gold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#A1A1AA]">Direct Concierge Phone</label>
                <input
                  type="text"
                  value={salonPhone}
                  onChange={(e) => setSalonPhone(e.target.value)}
                  className="w-full bg-[#0B0B0D] border border-charcoal-border rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-gold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#A1A1AA]">Street Address</label>
                <input
                  type="text"
                  value={salonAddress}
                  onChange={(e) => setSalonAddress(e.target.value)}
                  className="w-full bg-[#0B0B0D] border border-charcoal-border rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-gold"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gold text-black font-bold text-xs uppercase tracking-wider hover:bg-gold-light transition-all"
              >
                Save Atelier Settings
              </button>
            </form>
          </div>
        )}

        {/* MODAL: ADD WALK-IN CLIENT */}
        {walkinModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#171719] border border-gold-border/50 rounded-2xl p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl">
              <div className="flex justify-between items-center pb-3 border-b border-charcoal-border">
                <h3 className="text-base font-bold text-white flex items-center">
                  <UserPlus className="w-4 h-4 text-gold mr-2" />
                  Add Walk-In to Live Queue
                </h3>
                <button
                  onClick={() => setWalkinModalOpen(false)}
                  className="text-[#71717A] hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddWalkin} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="text-[#A1A1AA] font-semibold">Client Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={walkinName}
                    onChange={(e) => setWalkinName(e.target.value)}
                    className="w-full bg-[#0B0B0D] border border-charcoal-border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#A1A1AA] font-semibold">Phone (for Live Queue SMS)</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 00000"
                    value={walkinPhone}
                    onChange={(e) => setWalkinPhone(e.target.value)}
                    className="w-full bg-[#0B0B0D] border border-charcoal-border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#A1A1AA] font-semibold">Select Service</label>
                  <select
                    value={walkinServiceId}
                    onChange={(e) => setWalkinServiceId(e.target.value)}
                    className="w-full bg-[#0B0B0D] border border-charcoal-border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold"
                  >
                    {salon.services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} (₹{s.price} • {s.durationMinutes}m)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[#A1A1AA] font-semibold">Assign Barber</label>
                  <select
                    value={walkinStaffId}
                    onChange={(e) => setWalkinStaffId(e.target.value)}
                    className="w-full bg-[#0B0B0D] border border-charcoal-border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold"
                  >
                    <option value="any">First Available Master Barber</option>
                    {salon.staff.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.name} ({st.roleTitle})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-3 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setWalkinModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-[#A1A1AA] hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gold text-black font-bold uppercase tracking-wider hover:bg-gold-light"
                  >
                    Generate Token
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: SKIP / CANCEL TOKEN WITH REASON */}
        {cancelModalBooking && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#171719] border border-red-500/40 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
              <h3 className="text-sm font-bold text-white flex items-center">
                <AlertTriangle className="w-4 h-4 text-red-400 mr-2" />
                Cancel or Skip Token #{cancelModalBooking.queueTokenNumber}
              </h3>
              <p className="text-xs text-[#A1A1AA]">
                Client: {cancelModalBooking.customerName} ({cancelModalBooking.bookingCode})
              </p>

              <div className="space-y-1 text-xs">
                <label className="text-[#A1A1AA] font-semibold">Select Reason</label>
                <select
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  className="w-full bg-[#0B0B0D] border border-charcoal-border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold"
                >
                  <option value="Customer no-show">Customer did not show up</option>
                  <option value="Client requested rescheduling">Client requested rescheduling</option>
                  <option value="Double booking resolution">Double booking resolution</option>
                  <option value="Chair maintenance">Barber / Chair maintenance</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  onClick={() => setCancelModalBooking(null)}
                  className="px-4 py-2 text-xs text-[#A1A1AA] hover:text-white"
                >
                  Back
                </button>
                <button
                  onClick={handleConfirmCancel}
                  className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold uppercase hover:bg-red-500"
                >
                  Confirm Cancellation
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
