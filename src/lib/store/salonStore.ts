"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Salon, Booking, User, BookingStatus, PlatformMetric } from "@/types";
import {
  MOCK_SALONS,
  MOCK_BOOKINGS,
  MOCK_USERS,
  MOCK_PLATFORM_METRICS,
} from "../data/mockData";
import { calculateQueueWaitTime } from "../queue/waitTimeCalculator";
import { apiClient } from "../api";

const STORAGE_KEY_SALONS = "salonx_salons_v4";
const STORAGE_KEY_BOOKINGS = "salonx_bookings_v4";
const STORAGE_KEY_USER = "salonx_current_user_v4";
const STORAGE_KEY_METRICS = "salonx_metrics_v4";
const QUEUE_EVENT_NAME = "salonx_queue_updated";

export function getStoredData<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function setStoredData<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Storage error:", e);
  }
}

export interface BackendStatusState {
  online: boolean;
  driver: "supabase" | "in-memory-api" | "local_fallback";
  isConfigured: boolean;
  isSyncing: boolean;
  lastSyncAt: string | null;
}

// Hook to access and manipulate global SalonX state with live backend synchronization
export function useSalonStore() {
  const [salons, setSalons] = useState<Salon[]>(() =>
    getStoredData(STORAGE_KEY_SALONS, MOCK_SALONS)
  );
  const [bookings, setBookings] = useState<Booking[]>(() =>
    getStoredData(STORAGE_KEY_BOOKINGS, MOCK_BOOKINGS)
  );
  const [currentUser, setCurrentUser] = useState<User>(() =>
    getStoredData(STORAGE_KEY_USER, MOCK_USERS[0])
  );
  const [metrics, setMetrics] = useState<PlatformMetric>(() =>
    getStoredData(STORAGE_KEY_METRICS, MOCK_PLATFORM_METRICS)
  );
  const [backendStatus, setBackendStatus] = useState<BackendStatusState>({
    online: false,
    driver: "in-memory-api",
    isConfigured: false,
    isSyncing: true,
    lastSyncAt: null,
  });

  const isMountedRef = useRef(true);

  const broadcastChange = useCallback(() => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event(QUEUE_EVENT_NAME));
    }
  }, []);

  // Fetch live backend data
  const refreshData = useCallback(async () => {
    try {
      setBackendStatus((prev) => ({ ...prev, isSyncing: true }));

      // Fetch health & backend status
      const healthRes = await apiClient.health.check().catch(() => null);

      // Fetch live salons, bookings and metrics in parallel
      const [salonsRes, bookingsRes, metricsRes] = await Promise.all([
        apiClient.salons.list().catch(() => null),
        apiClient.bookings.list().catch(() => null),
        apiClient.metrics.get().catch(() => null),
      ]);

      if (!isMountedRef.current) return;

      if (salonsRes && salonsRes.success && salonsRes.salons.length > 0) {
        setSalons(salonsRes.salons);
        setStoredData(STORAGE_KEY_SALONS, salonsRes.salons);
      }

      if (bookingsRes && bookingsRes.success) {
        setBookings(bookingsRes.bookings);
        setStoredData(STORAGE_KEY_BOOKINGS, bookingsRes.bookings);
      }

      if (metricsRes && metricsRes.success) {
        setMetrics(metricsRes.metrics);
        setStoredData(STORAGE_KEY_METRICS, metricsRes.metrics);
      }

      setBackendStatus({
        online: Boolean(healthRes && healthRes.success),
        driver: (healthRes?.driver as any) || "in-memory-api",
        isConfigured: Boolean(healthRes?.isConfigured),
        isSyncing: false,
        lastSyncAt: new Date().toLocaleTimeString(),
      });
    } catch (err) {
      console.warn("Backend sync notice (running on resilient client cache):", err);
      if (isMountedRef.current) {
        setBackendStatus((prev) => ({
          ...prev,
          online: false,
          isSyncing: false,
        }));
      }
    }
  }, []);

  // Sync with backend on mount and set up periodic live sync
  useEffect(() => {
    isMountedRef.current = true;
    refreshData();

    // Periodic live sync every 8 seconds for real-time queue
    const interval = setInterval(() => {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        refreshData();
      }
    }, 8000);

    return () => {
      isMountedRef.current = false;
      clearInterval(interval);
    };
  }, [refreshData]);

  // Sync with cross-tab / window storage events
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY_BOOKINGS && e.newValue) {
        setBookings(JSON.parse(e.newValue));
      }
      if (e.key === STORAGE_KEY_SALONS && e.newValue) {
        setSalons(JSON.parse(e.newValue));
      }
      if (e.key === STORAGE_KEY_USER && e.newValue) {
        setCurrentUser(JSON.parse(e.newValue));
      }
    };

    const handleCustomQueueEvent = () => {
      const refreshedBookings = getStoredData(STORAGE_KEY_BOOKINGS, MOCK_BOOKINGS);
      const refreshedSalons = getStoredData(STORAGE_KEY_SALONS, MOCK_SALONS);
      setBookings(refreshedBookings);
      setSalons(refreshedSalons);
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener(QUEUE_EVENT_NAME, handleCustomQueueEvent);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(QUEUE_EVENT_NAME, handleCustomQueueEvent);
    };
  }, []);

  // Switch role / user
  const switchUser = (userId: string) => {
    const target = MOCK_USERS.find((u) => u.id === userId) || MOCK_USERS[0];
    setCurrentUser(target);
    setStoredData(STORAGE_KEY_USER, target);
  };

  // Atomic queue token generation helper
  const getNextTokenNumber = (salonId: string, bookingDate: string): number => {
    const existing = bookings.filter(
      (b) => b.salonId === salonId && b.bookingDate === bookingDate
    );
    if (existing.length === 0) return 1;
    const maxToken = Math.max(...existing.map((b) => b.queueTokenNumber || 0));
    return maxToken + 1;
  };

  // Create booking (Optimistic + Backend API)
  const createBooking = (
    newBooking: Omit<
      Booking,
      | "id"
      | "bookingCode"
      | "queueTokenNumber"
      | "status"
      | "queueJoinedAt"
      | "created_at"
      | "estimatedWaitMinutes"
    >
  ): Booking => {
    const today = new Date().toISOString().split("T")[0];
    const isToday = newBooking.bookingDate === today;
    const tokenNum = getNextTokenNumber(newBooking.salonId, newBooking.bookingDate);
    const codeNum = Math.floor(1000 + Math.random() * 9000);
    const bookingCode = `SX-${codeNum}`;

    const salon = salons.find((s) => s.id === newBooking.salonId);

    // Initial estimation
    const waitResult = salon
      ? calculateQueueWaitTime({
          salon,
          allBookings: bookings,
          preferredStaffId: newBooking.staffId,
        })
      : { estimatedWaitMinutes: 20 };

    const booking: Booking = {
      ...newBooking,
      id: `bk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      bookingCode,
      queueTokenNumber: tokenNum,
      status: "confirmed",
      estimatedWaitMinutes: isToday ? waitResult.estimatedWaitMinutes : 0,
      queueJoinedAt: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    const updatedBookings = [booking, ...bookings];
    setBookings(updatedBookings);
    setStoredData(STORAGE_KEY_BOOKINGS, updatedBookings);

    // Update salon queue stats locally
    if (salon && isToday) {
      const activeQueue = updatedBookings.filter(
        (b) =>
          b.salonId === salon.id &&
          (b.status === "confirmed" || b.status === "in_service")
      );
      const updatedSalons = salons.map((s) =>
        s.id === salon.id
          ? {
              ...s,
              activeQueueCount: activeQueue.length,
            }
          : s
      );
      setSalons(updatedSalons);
      setStoredData(STORAGE_KEY_SALONS, updatedSalons);
    }

    broadcastChange();

    // Async call to backend API
    apiClient.bookings
      .create(newBooking)
      .then((res) => {
        if (res.success && res.booking) {
          // Replace optimistic booking with server booking
          setBookings((prev) =>
            prev.map((b) => (b.id === booking.id ? res.booking : b))
          );
        }
      })
      .catch((err) => {
        console.warn("Backend booking API sync error:", err);
      });

    return booking;
  };

  // Update booking status (Salon Owner queue advancement)
  const updateBookingStatus = (
    bookingId: string,
    status: BookingStatus,
    reason?: string
  ) => {
    const updatedBookings = bookings.map((b) => {
      if (b.id !== bookingId) return b;
      const patch: Partial<Booking> = { status };
      if (status === "in_service") {
        patch.serviceStartedAt = new Date().toISOString();
      } else if (status === "completed") {
        patch.serviceCompletedAt = new Date().toISOString();
      } else if (status === "cancelled" && reason) {
        patch.cancellationReason = reason;
      }
      return { ...b, ...patch };
    });

    setBookings(updatedBookings);
    setStoredData(STORAGE_KEY_BOOKINGS, updatedBookings);

    // Update salon's current serving token
    const targetBooking = bookings.find((b) => b.id === bookingId);
    if (targetBooking) {
      const salon = salons.find((s) => s.id === targetBooking.salonId);
      if (salon) {
        let newServing = salon.currentServingToken;
        if (status === "in_service") {
          newServing = targetBooking.queueTokenNumber;
        } else if (status === "completed" || status === "cancelled") {
          const pending = updatedBookings
            .filter(
              (b) =>
                b.salonId === salon.id &&
                b.status === "in_service"
            )
            .sort((a, b) => a.queueTokenNumber - b.queueTokenNumber);
          if (pending.length > 0) {
            newServing = pending[0].queueTokenNumber;
          }
        }

        const activeCount = updatedBookings.filter(
          (b) =>
            b.salonId === salon.id &&
            (b.status === "confirmed" || b.status === "in_service")
        ).length;

        const updatedSalons = salons.map((s) =>
          s.id === salon.id
            ? {
                ...s,
                currentServingToken: newServing,
                activeQueueCount: activeCount,
              }
            : s
        );
        setSalons(updatedSalons);
        setStoredData(STORAGE_KEY_SALONS, updatedSalons);
      }
    }

    broadcastChange();

    // Async update on backend API
    apiClient.bookings.updateStatus(bookingId, status, reason).catch((err) => {
      console.warn("Backend booking status update error:", err);
    });
  };

  // Salon Owner updates salon details
  const updateSalon = (salonId: string, patch: Partial<Salon>) => {
    const updated = salons.map((s) => (s.id === salonId ? { ...s, ...patch } : s));
    setSalons(updated);
    setStoredData(STORAGE_KEY_SALONS, updated);
    broadcastChange();

    // Async backend update
    apiClient.salons.update(salonId, patch).catch((err) => {
      console.warn("Backend salon update error:", err);
    });
  };

  // Super Admin approves or rejects salon
  const setSalonApproval = (salonId: string, status: "active" | "rejected") => {
    const updated = salons.map((s) =>
      s.id === salonId
        ? { ...s, status, isVerified: status === "active" }
        : s
    );
    setSalons(updated);
    setStoredData(STORAGE_KEY_SALONS, updated);

    // Update metrics
    const newMetrics = {
      ...metrics,
      activeSalons: updated.filter((s) => s.status === "active").length,
      pendingApprovals: updated.filter((s) => s.status === "pending").length,
    };
    setMetrics(newMetrics);
    setStoredData(STORAGE_KEY_METRICS, newMetrics);
    broadcastChange();

    // Async backend update
    apiClient.salons.update(salonId, { status, isVerified: status === "active" }).catch((err) => {
      console.warn("Backend salon approval update error:", err);
    });
  };

  // Register a new salon (for Become Partner)
  const registerSalon = async (salonData: Partial<Salon>): Promise<Salon> => {
    const id = `salon_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newSalon: Salon = {
      id,
      slug: salonData.name ? salonData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") : id,
      name: salonData.name || "New Atelier",
      tagline: salonData.tagline || "Elite Grooming",
      description: salonData.description || "Partner salon delivering signature grooming.",
      address: salonData.address || "Main Boulevard",
      city: salonData.city || "Mumbai",
      area: salonData.area || "City Center",
      pincode: salonData.pincode || "400001",
      latitude: 19.076,
      longitude: 72.8777,
      phone: salonData.phone || "+91 99999 00000",
      email: salonData.email || "concierge@salon.com",
      rating: 5.0,
      reviewCount: 0,
      bannerImage:
        salonData.bannerImage ||
        "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=1200&auto=format&fit=crop",
      galleryImages: [],
      startingPrice: salonData.startingPrice || 500,
      openingHours: [],
      services: [],
      staff: [],
      amenities: ["Wi-Fi", "Air Conditioning"],
      isVerified: false,
      status: "pending",
      ownerId: currentUser.id,
      currentServingToken: 0,
      activeQueueCount: 0,
      estimatedWaitPerCustomerMinutes: 20,
    };

    const updatedSalons = [newSalon, ...salons];
    setSalons(updatedSalons);
    setStoredData(STORAGE_KEY_SALONS, updatedSalons);

    const updatedMetrics = {
      ...metrics,
      totalSalons: metrics.totalSalons + 1,
      pendingApprovals: metrics.pendingApprovals + 1,
    };
    setMetrics(updatedMetrics);
    setStoredData(STORAGE_KEY_METRICS, updatedMetrics);

    broadcastChange();

    // Call backend API
    try {
      const res = await apiClient.salons.create(newSalon);
      if (res.success && res.salon) {
        setSalons((prev) => prev.map((s) => (s.id === newSalon.id ? res.salon : s)));
        return res.salon;
      }
    } catch (e) {
      console.warn("Backend salon registration notice:", e);
    }

    return newSalon;
  };

  // Reset to demo data
  const resetDemoData = () => {
    setSalons(MOCK_SALONS);
    setBookings(MOCK_BOOKINGS);
    setCurrentUser(MOCK_USERS[0]);
    setMetrics(MOCK_PLATFORM_METRICS);
    setStoredData(STORAGE_KEY_SALONS, MOCK_SALONS);
    setStoredData(STORAGE_KEY_BOOKINGS, MOCK_BOOKINGS);
    setStoredData(STORAGE_KEY_USER, MOCK_USERS[0]);
    setStoredData(STORAGE_KEY_METRICS, MOCK_PLATFORM_METRICS);
    broadcastChange();
    refreshData();
  };

  return {
    salons,
    bookings,
    currentUser,
    metrics,
    backendStatus,
    switchUser,
    createBooking,
    updateBookingStatus,
    updateSalon,
    setSalonApproval,
    registerSalon,
    resetDemoData,
    refreshData,
    getNextTokenNumber,
  };
}
