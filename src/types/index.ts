export type UserRole = "customer" | "salon_owner" | "admin";

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: UserRole;
  avatar_url?: string;
  salon_id?: string; // If salon owner
  created_at: string;
}

export interface OperatingHours {
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  open: string;
  close: string;
  isOpen: boolean;
}

export interface ServiceItem {
  id: string;
  salon_id: string;
  name: string;
  category: "Haircut" | "Hair Styling" | "Beard Trimming" | "Hair Wash" | "Facial" | "Hair Coloring" | "Spa" | "Treatments" | "Other";
  description: string;
  price: number;
  durationMinutes: number; // e.g. 30, 45, 60
  image_url?: string;
  popular?: boolean;
}

export interface SalonStaff {
  id: string;
  salon_id: string;
  name: string;
  roleTitle: string; // e.g. "Master Barber", "Senior Stylist", "Color Specialist"
  avatar_url: string;
  rating: number;
  reviewsCount: number;
  isAvailable: boolean;
  specialties: string[];
  activeTicketId?: string | null;
}

export interface Salon {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  address: string;
  city: string;
  area: string;
  pincode: string;
  latitude: number;
  longitude: number;
  phone: string;
  email: string;
  rating: number;
  reviewCount: number;
  bannerImage: string;
  galleryImages: string[];
  startingPrice: number;
  openingHours: OperatingHours[];
  services: ServiceItem[];
  staff: SalonStaff[];
  amenities: string[];
  isVerified: boolean;
  status: "active" | "pending" | "rejected";
  ownerId: string;
  // Queue live stats
  currentServingToken: number;
  activeQueueCount: number;
  estimatedWaitPerCustomerMinutes: number; // dynamically computed average
}

export type BookingType = "appointment" | "walk_in";
export type BookingStatus = "confirmed" | "in_service" | "completed" | "cancelled" | "no_show";

export interface Booking {
  id: string;
  bookingCode: string; // e.g. SX-8924
  salonId: string;
  salonName: string;
  salonAddress: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  serviceIds: string[];
  serviceNames: string[];
  totalAmount: number;
  totalDurationMinutes: number;
  staffId?: string;
  staffName?: string;
  bookingType: BookingType;
  bookingDate: string; // YYYY-MM-DD
  timeSlot?: string; // e.g. "14:30"
  queueTokenNumber: number; // e.g. 12
  status: BookingStatus;
  notes?: string;
  estimatedWaitMinutes: number;
  queueJoinedAt: string; // ISO
  serviceStartedAt?: string;
  serviceCompletedAt?: string;
  cancellationReason?: string;
  created_at: string;
}

export interface Review {
  id: string;
  salon_id: string;
  customer_name: string;
  customer_avatar?: string;
  rating: number;
  date: string;
  comment: string;
  service_name?: string;
}

export interface PlatformMetric {
  totalSalons: number;
  activeSalons: number;
  pendingApprovals: number;
  totalCustomers: number;
  totalBookings: number;
  todayBookings: number;
  platformRevenue: number;
  commissionEarned: number;
}
