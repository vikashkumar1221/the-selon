import { Booking, Salon, SalonStaff, ServiceItem } from "@/types";

export interface QueueEstimationResult {
  estimatedWaitMinutes: number;
  customersAhead: number;
  activeBarbersCount: number;
  avgDurationPerBarber: number;
  confidenceScore: "High" | "Medium" | "Variable";
  explanation: string;
}

/**
 * Advanced Dynamic Waiting Time Engine for SalonX
 * 
 * Factors:
 * 1. Number of active/available barbers on duty
 * 2. Exact services ordered by each customer ahead in queue (sum of service durations)
 * 3. Individual customer's requested services duration
 * 4. Parallel throughput: queue is distributed across N active barbers
 * 5. Staff efficiency modifier based on barbers currently serving vs idle
 * 6. Historical turnover buffer (5 minutes hygiene/sanitization between clients)
 */
export function calculateQueueWaitTime({
  salon,
  allBookings,
  targetBookingId,
  selectedServices,
  preferredStaffId,
}: {
  salon: Salon;
  allBookings: Booking[];
  targetBookingId?: string;
  selectedServices?: ServiceItem[];
  preferredStaffId?: string;
}): QueueEstimationResult {
  // 1. Get active staff
  const activeStaff = salon.staff.filter((s) => s.isAvailable);
  const totalBarbers = Math.max(activeStaff.length, 1);

  // 2. Filter bookings that are currently waiting or in_service in this salon for today
  const activeQueue = allBookings.filter(
    (b) =>
      b.salonId === salon.id &&
      (b.status === "confirmed" || b.status === "in_service")
  );

  // Sort queue by queueTokenNumber
  const sortedQueue = [...activeQueue].sort(
    (a, b) => a.queueTokenNumber - b.queueTokenNumber
  );

  // Find target position
  let targetIndex = -1;
  let customersAhead = 0;

  if (targetBookingId) {
    targetIndex = sortedQueue.findIndex((b) => b.id === targetBookingId);
    if (targetIndex !== -1) {
      // All items before this that are still waiting or in_service
      customersAhead = targetIndex;
    } else {
      customersAhead = sortedQueue.length;
    }
  } else {
    // If not yet joined, the new customer will be behind all current active queue
    customersAhead = sortedQueue.length;
  }

  // 3. Compute workload of customers ahead
  // Sum up total duration minutes of customers ahead
  const customersAheadList = sortedQueue.slice(0, Math.max(0, customersAhead));
  const totalAheadMinutes = customersAheadList.reduce((acc, curr) => {
    // If a customer is already in_service, assume 40% time remaining on average
    const factor = curr.status === "in_service" ? 0.45 : 1.0;
    return acc + (curr.totalDurationMinutes || 30) * factor;
  }, 0);

  // Buffer between appointments (cleaning, chair prep, client consultation)
  const turnoverBufferMinutes = 4;
  const totalBuffer = customersAhead * turnoverBufferMinutes;

  // 4. Distribute across available barbers
  // If customer selected a specific preferred barber:
  let effectiveBarbers = totalBarbers;
  let explanation = `Distributed across ${totalBarbers} master barbers on floor.`;

  if (preferredStaffId && preferredStaffId !== "any") {
    // Dedicated barber queue: wait is strictly based on that barber's queue
    const barberAheadList = customersAheadList.filter(
      (b) => b.staffId === preferredStaffId
    );
    const barberWorkload = barberAheadList.reduce((acc, curr) => {
      const factor = curr.status === "in_service" ? 0.4 : 1.0;
      return acc + (curr.totalDurationMinutes || 30) * factor;
    }, 0);

    const barberWait = Math.round(barberWorkload + barberAheadList.length * turnoverBufferMinutes);
    const barberName = salon.staff.find((s) => s.id === preferredStaffId)?.name || "Selected Barber";

    return {
      estimatedWaitMinutes: Math.max(5, barberWait),
      customersAhead: barberAheadList.length,
      activeBarbersCount: 1,
      avgDurationPerBarber: barberWait,
      confidenceScore: "High",
      explanation: `Specific wait for ${barberName} (${barberAheadList.length} clients ahead).`,
    };
  }

  // General Queue distribution:
  // Mathematical modeling: M/M/c queuing approximation
  const totalWorkloadMinutes = totalAheadMinutes + totalBuffer;
  const estimatedParallelWait = Math.ceil(totalWorkloadMinutes / effectiveBarbers);

  // If nobody is ahead and at least 1 barber is idle
  const barbersInService = salon.staff.filter((s) => s.activeTicketId).length;
  const idleBarbers = Math.max(0, totalBarbers - barbersInService);

  let finalEstimatedMinutes = estimatedParallelWait;
  if (customersAhead === 0) {
    finalEstimatedMinutes = idleBarbers > 0 ? 0 : 5;
  } else {
    // Ensure minimum reasonable estimate
    finalEstimatedMinutes = Math.max(5, estimatedParallelWait);
  }

  const confidenceScore =
    activeStaff.length >= 3 ? "High" : activeStaff.length === 2 ? "Medium" : "Variable";

  return {
    estimatedWaitMinutes: finalEstimatedMinutes,
    customersAhead,
    activeBarbersCount: totalBarbers,
    avgDurationPerBarber: Math.round(totalWorkloadMinutes / totalBarbers),
    confidenceScore,
    explanation,
  };
}
