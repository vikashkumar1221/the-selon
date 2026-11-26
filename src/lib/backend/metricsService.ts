import { PlatformMetric } from "@/types";
import { memoryDb } from "./db";

export async function getPlatformMetrics(): Promise<PlatformMetric> {
  const activeSalons = memoryDb.salons.filter((s) => s.status === "active").length;
  const pendingApprovals = memoryDb.salons.filter((s) => s.status === "pending").length;
  const totalSalons = memoryDb.salons.length;

  const totalBookings = memoryDb.bookings.length;
  const today = new Date().toISOString().split("T")[0];
  const todayBookings = memoryDb.bookings.filter((b) => b.bookingDate === today).length;

  const completedRevenue = memoryDb.bookings
    .filter((b) => b.status === "completed")
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const totalRevenue = completedRevenue + memoryDb.metrics.platformRevenue;
  const commission = Math.round((totalRevenue * 15) / 100);

  return {
    totalSalons,
    activeSalons,
    pendingApprovals,
    totalCustomers: memoryDb.metrics.totalCustomers,
    totalBookings,
    todayBookings,
    platformRevenue: totalRevenue,
    commissionEarned: commission,
  };
}
