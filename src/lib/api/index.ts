import { Salon, Booking, BookingStatus, PlatformMetric } from "@/types";

const API_BASE = "";

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    // Don't cache on client fetches to ensure live real-time queue data
    cache: "no-store",
  });

  if (!res.ok) {
    let errMsg = `API error ${res.status}: ${res.statusText}`;
    try {
      const body = await res.json();
      if (body.error) errMsg = body.error;
    } catch {}
    throw new Error(errMsg);
  }

  return res.json() as Promise<T>;
}

export const apiClient = {
  salons: {
    list: async (params?: {
      city?: string;
      category?: string;
      status?: string;
      search?: string;
    }): Promise<{ success: boolean; count: number; salons: Salon[] }> => {
      const search = new URLSearchParams();
      if (params?.city) search.set("city", params.city);
      if (params?.category) search.set("category", params.category);
      if (params?.status) search.set("status", params.status);
      if (params?.search) search.set("search", params.search);

      const qs = search.toString();
      return fetchJson<{ success: boolean; count: number; salons: Salon[] }>(
        `/api/salons${qs ? `?${qs}` : ""}`
      );
    },

    getById: async (id: string): Promise<{ success: boolean; salon: Salon }> => {
      return fetchJson<{ success: boolean; salon: Salon }>(`/api/salons/${encodeURIComponent(id)}`);
    },

    create: async (
      salon: Partial<Salon>
    ): Promise<{ success: boolean; message: string; salon: Salon }> => {
      return fetchJson<{ success: boolean; message: string; salon: Salon }>("/api/salons", {
        method: "POST",
        body: JSON.stringify(salon),
      });
    },

    update: async (
      id: string,
      patch: Partial<Salon>
    ): Promise<{ success: boolean; message: string; salon: Salon }> => {
      return fetchJson<{ success: boolean; message: string; salon: Salon }>(
        `/api/salons/${encodeURIComponent(id)}`,
        {
          method: "PATCH",
          body: JSON.stringify(patch),
        }
      );
    },
  },

  bookings: {
    list: async (params?: {
      salonId?: string;
      customerId?: string;
      phone?: string;
      status?: string;
      date?: string;
    }): Promise<{ success: boolean; count: number; bookings: Booking[] }> => {
      const search = new URLSearchParams();
      if (params?.salonId) search.set("salonId", params.salonId);
      if (params?.customerId) search.set("customerId", params.customerId);
      if (params?.phone) search.set("phone", params.phone);
      if (params?.status) search.set("status", params.status);
      if (params?.date) search.set("date", params.date);

      const qs = search.toString();
      return fetchJson<{ success: boolean; count: number; bookings: Booking[] }>(
        `/api/bookings${qs ? `?${qs}` : ""}`
      );
    },

    getById: async (id: string): Promise<{ success: boolean; booking: Booking }> => {
      return fetchJson<{ success: boolean; booking: Booking }>(
        `/api/bookings/${encodeURIComponent(id)}`
      );
    },

    create: async (
      booking: Omit<
        Booking,
        | "id"
        | "bookingCode"
        | "queueTokenNumber"
        | "status"
        | "queueJoinedAt"
        | "created_at"
        | "estimatedWaitMinutes"
      >
    ): Promise<{ success: boolean; message: string; booking: Booking }> => {
      return fetchJson<{ success: boolean; message: string; booking: Booking }>("/api/bookings", {
        method: "POST",
        body: JSON.stringify(booking),
      });
    },

    updateStatus: async (
      id: string,
      status: BookingStatus,
      cancellationReason?: string
    ): Promise<{ success: boolean; message: string; booking: Booking }> => {
      return fetchJson<{ success: boolean; message: string; booking: Booking }>(
        `/api/bookings/${encodeURIComponent(id)}`,
        {
          method: "PATCH",
          body: JSON.stringify({ status, cancellationReason }),
        }
      );
    },
  },

  queue: {
    get: async (salonId: string): Promise<{ success: boolean; queue: any }> => {
      return fetchJson<{ success: boolean; queue: any }>(
        `/api/queue?salonId=${encodeURIComponent(salonId)}`
      );
    },
  },

  metrics: {
    get: async (): Promise<{ success: boolean; metrics: PlatformMetric }> => {
      return fetchJson<{ success: boolean; metrics: PlatformMetric }>("/api/metrics");
    },
  },

  health: {
    check: async (): Promise<{
      success: boolean;
      status: string;
      isConfigured: boolean;
      driver: string;
      salonsCount: number;
      bookingsCount: number;
      activeQueueCount: number;
    }> => {
      return fetchJson("/api/health");
    },
  },
};
