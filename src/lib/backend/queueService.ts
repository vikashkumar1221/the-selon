import { memoryDb } from "./db";
import { calculateQueueWaitTime } from "@/lib/queue/waitTimeCalculator";

export interface QueueLiveDetails {
  salonId: string;
  salonName: string;
  currentServingToken: number;
  activeQueueCount: number;
  estimatedWaitMinutes: number;
  waitingBookings: {
    id: string;
    bookingCode: string;
    tokenNumber: number;
    customerName: string;
    serviceNames: string[];
    estimatedWaitMinutes: number;
    status: string;
  }[];
  nowServing: {
    id: string;
    bookingCode: string;
    tokenNumber: number;
    customerName: string;
    serviceNames: string[];
  } | null;
}

export async function getSalonQueueStatus(salonId: string): Promise<QueueLiveDetails | null> {
  const salon = memoryDb.salons.find((s) => s.id === salonId || s.slug === salonId);
  if (!salon) return null;

  const today = new Date().toISOString().split("T")[0];
  const activeBookings = memoryDb.bookings.filter(
    (b) =>
      b.salonId === salon.id &&
      b.bookingDate === today &&
      (b.status === "confirmed" || b.status === "in_service")
  );

  const nowServingBooking =
    activeBookings.find((b) => b.status === "in_service") ||
    activeBookings.find((b) => b.queueTokenNumber === salon.currentServingToken) ||
    null;

  const waitingBookings = activeBookings
    .filter((b) => b.status === "confirmed")
    .sort((a, b) => a.queueTokenNumber - b.queueTokenNumber)
    .map((b) => ({
      id: b.id,
      bookingCode: b.bookingCode,
      tokenNumber: b.queueTokenNumber,
      customerName: b.customerName,
      serviceNames: b.serviceNames,
      estimatedWaitMinutes: b.estimatedWaitMinutes,
      status: b.status,
    }));

  const waitCalculation = calculateQueueWaitTime({
    salon,
    allBookings: memoryDb.bookings,
  });

  return {
    salonId: salon.id,
    salonName: salon.name,
    currentServingToken: salon.currentServingToken,
    activeQueueCount: activeBookings.length,
    estimatedWaitMinutes: waitCalculation.estimatedWaitMinutes,
    waitingBookings,
    nowServing: nowServingBooking
      ? {
          id: nowServingBooking.id,
          bookingCode: nowServingBooking.bookingCode,
          tokenNumber: nowServingBooking.queueTokenNumber,
          customerName: nowServingBooking.customerName,
          serviceNames: nowServingBooking.serviceNames,
        }
      : null,
  };
}
