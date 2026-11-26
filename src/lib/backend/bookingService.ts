import { Booking, BookingStatus } from "@/types";
import { memoryDb } from "./db";
import { getServerSupabase, isServerSupabaseConfigured } from "@/lib/supabase/server";
import { calculateQueueWaitTime } from "@/lib/queue/waitTimeCalculator";

export interface BookingFilterParams {
  salonId?: string;
  customerId?: string;
  customerPhone?: string;
  status?: string;
  date?: string;
}

export async function getAllBookings(params: BookingFilterParams = {}): Promise<Booking[]> {
  const supabase = getServerSupabase();
  if (isServerSupabaseConfigured() && supabase) {
    try {
      let query = supabase.from("bookings").select("*");

      if (params.salonId) query = query.eq("salon_id", params.salonId);
      if (params.customerId) query = query.eq("customer_id", params.customerId);
      if (params.customerPhone) query = query.eq("customer_phone", params.customerPhone);
      if (params.status) query = query.eq("status", params.status);
      if (params.date) query = query.eq("booking_date", params.date);

      const { data, error } = await query.order("created_at", { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map((b) => ({
          id: b.id,
          bookingCode: b.booking_code,
          salonId: b.salon_id,
          salonName: memoryDb.salons.find((s) => s.id === b.salon_id)?.name || "Luxury Salon",
          salonAddress: memoryDb.salons.find((s) => s.id === b.salon_id)?.address || "Mumbai",
          customerId: b.customer_id || "usr_customer_anon",
          customerName: b.customer_name,
          customerPhone: b.customer_phone,
          customerEmail: b.customer_email || "",
          serviceIds: [],
          serviceNames: ["Signature Grooming"],
          totalAmount: Number(b.total_amount),
          totalDurationMinutes: b.total_duration_minutes || 30,
          staffId: b.staff_id,
          staffName: "Master Barber",
          bookingType: b.booking_type,
          bookingDate: b.booking_date,
          timeSlot: b.time_slot,
          queueTokenNumber: b.queue_token_number,
          status: b.status,
          estimatedWaitMinutes: b.estimated_wait_minutes || 0,
          queueJoinedAt: b.created_at,
          serviceStartedAt: b.service_started_at,
          serviceCompletedAt: b.service_completed_at,
          cancellationReason: b.cancellation_reason,
          created_at: b.created_at,
        }));
      }
    } catch (e) {
      console.warn("Failed to fetch bookings from Supabase, using memory DB:", e);
    }
  }

  let result = [...memoryDb.bookings];

  if (params.salonId) {
    result = result.filter((b) => b.salonId === params.salonId);
  }
  if (params.customerId) {
    result = result.filter(
      (b) => b.customerId === params.customerId || b.customerPhone === params.customerPhone
    );
  }
  if (params.customerPhone) {
    result = result.filter((b) => b.customerPhone === params.customerPhone);
  }
  if (params.status) {
    result = result.filter((b) => b.status === params.status);
  }
  if (params.date) {
    result = result.filter((b) => b.bookingDate === params.date);
  }

  return result;
}

export async function getBookingById(idOrCode: string): Promise<Booking | null> {
  const booking = memoryDb.bookings.find(
    (b) => b.id === idOrCode || b.bookingCode.toUpperCase() === idOrCode.toUpperCase()
  );
  return booking || null;
}

// Atomic token calculation for concurrency safety
export function getNextTokenNumber(salonId: string, bookingDate: string): number {
  const existing = memoryDb.bookings.filter(
    (b) => b.salonId === salonId && b.bookingDate === bookingDate
  );
  if (existing.length === 0) return 1;
  const maxToken = Math.max(...existing.map((b) => b.queueTokenNumber || 0));
  return maxToken + 1;
}

export async function createBooking(
  input: Omit<
    Booking,
    | "id"
    | "bookingCode"
    | "queueTokenNumber"
    | "status"
    | "queueJoinedAt"
    | "created_at"
    | "estimatedWaitMinutes"
  >
): Promise<Booking> {
  const today = new Date().toISOString().split("T")[0];
  const isToday = input.bookingDate === today;
  const tokenNum = getNextTokenNumber(input.salonId, input.bookingDate);
  const codeNum = Math.floor(1000 + Math.random() * 9000);
  const bookingCode = `SX-${codeNum}`;

  const salon = memoryDb.salons.find((s) => s.id === input.salonId);

  // Dynamic queue wait calculation
  const waitResult = salon
    ? calculateQueueWaitTime({
        salon,
        allBookings: memoryDb.bookings,
        preferredStaffId: input.staffId,
      })
    : { estimatedWaitMinutes: 20 };

  const newBooking: Booking = {
    ...input,
    id: `bk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    bookingCode,
    queueTokenNumber: tokenNum,
    status: "confirmed",
    estimatedWaitMinutes: isToday ? waitResult.estimatedWaitMinutes : 0,
    queueJoinedAt: new Date().toISOString(),
    created_at: new Date().toISOString(),
  };

  memoryDb.bookings = [newBooking, ...memoryDb.bookings];
  memoryDb.metrics.totalBookings += 1;
  if (isToday) {
    memoryDb.metrics.todayBookings += 1;
  }

  // Update salon active queue
  if (salon && isToday) {
    const activeCount = memoryDb.bookings.filter(
      (b) =>
        b.salonId === salon.id &&
        (b.status === "confirmed" || b.status === "in_service")
    ).length;
    salon.activeQueueCount = activeCount;
  }

  // Supabase persist
  const supabase = getServerSupabase();
  if (isServerSupabaseConfigured() && supabase) {
    try {
      await supabase.from("bookings").insert({
        booking_code: newBooking.bookingCode,
        salon_id: newBooking.salonId,
        customer_id: newBooking.customerId.startsWith("usr_") ? null : newBooking.customerId,
        customer_name: newBooking.customerName,
        customer_phone: newBooking.customerPhone,
        customer_email: newBooking.customerEmail,
        staff_id: newBooking.staffId && !newBooking.staffId.startsWith("stf_") ? newBooking.staffId : null,
        booking_type: newBooking.bookingType,
        booking_date: newBooking.bookingDate,
        time_slot: newBooking.timeSlot || "14:00",
        total_amount: newBooking.totalAmount,
        total_duration_minutes: newBooking.totalDurationMinutes,
        status: newBooking.status,
        queue_token_number: newBooking.queueTokenNumber,
        estimated_wait_minutes: newBooking.estimatedWaitMinutes,
      });
    } catch (e) {
      console.warn("Failed to persist booking to Supabase:", e);
    }
  }

  return newBooking;
}

export async function updateBookingStatus(
  id: string,
  status: BookingStatus,
  reason?: string
): Promise<Booking | null> {
  const index = memoryDb.bookings.findIndex((b) => b.id === id);
  if (index === -1) return null;

  const prev = memoryDb.bookings[index];
  const patch: Partial<Booking> = { status };

  if (status === "in_service") {
    patch.serviceStartedAt = new Date().toISOString();
  } else if (status === "completed") {
    patch.serviceCompletedAt = new Date().toISOString();
    memoryDb.metrics.platformRevenue += prev.totalAmount;
  } else if (status === "cancelled" && reason) {
    patch.cancellationReason = reason;
  }

  memoryDb.bookings[index] = { ...prev, ...patch };
  const updatedBooking = memoryDb.bookings[index];

  // Update salon's serving token and active count
  const salon = memoryDb.salons.find((s) => s.id === updatedBooking.salonId);
  if (salon) {
    if (status === "in_service") {
      salon.currentServingToken = updatedBooking.queueTokenNumber;
    } else if (status === "completed" || status === "cancelled") {
      const nextPending = memoryDb.bookings
        .filter((b) => b.salonId === salon.id && b.status === "in_service")
        .sort((a, b) => a.queueTokenNumber - b.queueTokenNumber);
      if (nextPending.length > 0) {
        salon.currentServingToken = nextPending[0].queueTokenNumber;
      }
    }

    salon.activeQueueCount = memoryDb.bookings.filter(
      (b) =>
        b.salonId === salon.id &&
        (b.status === "confirmed" || b.status === "in_service")
    ).length;
  }

  // Supabase update
  const supabase = getServerSupabase();
  if (isServerSupabaseConfigured() && supabase) {
    try {
      const updatePayload: Record<string, any> = { status };
      if (patch.serviceStartedAt) updatePayload.service_started_at = patch.serviceStartedAt;
      if (patch.serviceCompletedAt) updatePayload.service_completed_at = patch.serviceCompletedAt;
      if (patch.cancellationReason) updatePayload.cancellation_reason = patch.cancellationReason;

      await supabase.from("bookings").update(updatePayload).eq("id", id);
    } catch (e) {
      console.warn("Failed to update booking status in Supabase:", e);
    }
  }

  return updatedBooking;
}
