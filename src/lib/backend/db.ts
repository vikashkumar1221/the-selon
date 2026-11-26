import { Salon, Booking, User, PlatformMetric } from "@/types";
import {
  MOCK_SALONS,
  MOCK_BOOKINGS,
  MOCK_USERS,
  MOCK_PLATFORM_METRICS,
} from "@/lib/data/mockData";
import { getServerSupabase, isServerSupabaseConfigured } from "@/lib/supabase/server";

// Global in-memory server database cache
// In Node.js server environments, global is preserved across API route invocations
interface BackendMemoryDb {
  salons: Salon[];
  bookings: Booking[];
  users: User[];
  metrics: PlatformMetric;
  queueTokens: Record<string, { lastAssignedToken: number; currentServingToken: number }>;
}

declare global {
  // eslint-disable-next-line no-var
  var __salonx_backend_db__: BackendMemoryDb | undefined;
}

function initMemoryDb(): BackendMemoryDb {
  if (!global.__salonx_backend_db__) {
    global.__salonx_backend_db__ = {
      salons: JSON.parse(JSON.stringify(MOCK_SALONS)),
      bookings: JSON.parse(JSON.stringify(MOCK_BOOKINGS)),
      users: JSON.parse(JSON.stringify(MOCK_USERS)),
      metrics: JSON.parse(JSON.stringify(MOCK_PLATFORM_METRICS)),
      queueTokens: {
        "salon_royal_crown": {
          lastAssignedToken: 12,
          currentServingToken: 9,
        },
      },
    };
  }
  return global.__salonx_backend_db__;
}

export const memoryDb = initMemoryDb();

export interface BackendStatus {
  isConfigured: boolean;
  driver: "supabase" | "in-memory-api";
  salonsCount: number;
  bookingsCount: number;
  activeQueueCount: number;
  timestamp: string;
}

export async function getBackendStatus(): Promise<BackendStatus> {
  const hasSupabase = isServerSupabaseConfigured();
  if (hasSupabase) {
    const supabase = getServerSupabase();
    if (supabase) {
      try {
        const { count: salonsCount, error: sErr } = await supabase
          .from("salons")
          .select("*", { count: "exact", head: true });
        const { count: bookingsCount, error: bErr } = await supabase
          .from("bookings")
          .select("*", { count: "exact", head: true });

        if (!sErr && !bErr) {
          const activeBookings = memoryDb.bookings.filter(
            (b) => b.status === "confirmed" || b.status === "in_service"
          ).length;

          return {
            isConfigured: true,
            driver: "supabase",
            salonsCount: salonsCount ?? memoryDb.salons.length,
            bookingsCount: bookingsCount ?? memoryDb.bookings.length,
            activeQueueCount: activeBookings,
            timestamp: new Date().toISOString(),
          };
        }
      } catch (err) {
        console.warn("Supabase query error, using server memory store:", err);
      }
    }
  }

  const activeBookings = memoryDb.bookings.filter(
    (b) => b.status === "confirmed" || b.status === "in_service"
  ).length;

  return {
    isConfigured: hasSupabase,
    driver: "in-memory-api",
    salonsCount: memoryDb.salons.length,
    bookingsCount: memoryDb.bookings.length,
    activeQueueCount: activeBookings,
    timestamp: new Date().toISOString(),
  };
}
