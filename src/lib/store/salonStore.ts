"use client";

import { useState, useEffect } from "react";
import { Salon, Booking, User, BookingStatus, PlatformMetric } from "@/types";
import {
  MOCK_SALONS,
  MOCK_BOOKINGS,
  MOCK_USERS,
  MOCK_PLATFORM_METRICS,
} from "../data/mockData";
import { calculateQueueWaitTime } from "../queue/waitTimeCalculator";

const STORAGE_KEY_SALONS = "salonx_salons_v3";
const STORAGE_KEY_BOOKINGS = "salonx_bookings_v3";
const STORAGE_KEY_USER = "salonx_current_user_v3";
const STORAGE_KEY_METRICS = "salonx_metrics_v3";
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

// Hook to access and manipulate global SalonX state
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

  const broadcastChange = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event(QUEUE_EVENT_NAME));
    }
  };

  // Switch role / user
  const switchUser = (userId: string) => {
    const target = MOCK_USERS.find((u) => u.id === userId) || MOCK_USERS[0];
    setCurrentUser(target);
    setStoredData(STORAGE_KEY_USER, target);
  };

  // Atomic queue token generation
  const getNextTokenNumber = (salonId: string, bookingDate: string): number => {
    const existing = bookings.filter(
      (b) => b.salonId === salonId && b.bookingDate === bookingDate
    );
    if (existing.length === 0) return 1;
    const maxToken = Math.max(...existing.map((b) => b.queueTokenNumber || 0));
    return maxToken + 1;
  };

  // Create booking
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
      id: `bk_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
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

    // Update salon queue stats
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
        // Find next lowest confirmed token or current serving
        let newServing = salon.currentServingToken;
        if (status === "in_service") {
          newServing = targetBooking.queueTokenNumber;
        } else if (status === "completed" || status === "cancelled") {
          // Find next pending
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
  };

  // Salon Owner updates salon details
  const updateSalon = (salonId: string, patch: Partial<Salon>) => {
    const updated = salons.map((s) => (s.id === salonId ? { ...s, ...patch } : s));
    setSalons(updated);
    setStoredData(STORAGE_KEY_SALONS, updated);
    broadcastChange();
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
  };

  return {
    salons,
    bookings,
    currentUser,
    metrics,
    switchUser,
    createBooking,
    updateBookingStatus,
    updateSalon,
    setSalonApproval,
    resetDemoData,
    getNextTokenNumber,
  };
}
