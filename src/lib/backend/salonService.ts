import { Salon } from "@/types";
import { memoryDb } from "./db";
import { getServerSupabase, isServerSupabaseConfigured } from "@/lib/supabase/server";

export interface SalonFilterParams {
  city?: string;
  category?: string;
  status?: string;
  search?: string;
}

export async function getAllSalons(params: SalonFilterParams = {}): Promise<Salon[]> {
  const supabase = getServerSupabase();
  if (isServerSupabaseConfigured() && supabase) {
    try {
      let query = supabase.from("salons").select(`
        *,
        opening_hours:operating_hours(*),
        services:services(*),
        staff:salon_staff(*)
      `);

      if (params.status) {
        query = query.eq("status", params.status);
      }
      if (params.city && params.city !== "All") {
        query = query.eq("city", params.city);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        // Map Supabase rows to TypeScript Salon models
        return data.map((row) => ({
          id: row.id,
          name: row.name,
          slug: row.slug || row.id,
          tagline: row.tagline || "",
          description: row.description || "",
          address: row.address,
          city: row.city,
          area: row.area,
          pincode: row.pincode || "",
          latitude: row.latitude || 0,
          longitude: row.longitude || 0,
          phone: row.phone,
          email: row.email,
          rating: Number(row.rating) || 5.0,
          reviewCount: row.review_count || 0,
          bannerImage: row.banner_image || "",
          galleryImages: row.gallery_images || [],
          startingPrice: Number(row.starting_price) || 0,
          openingHours: (row.opening_hours || []).map((oh: any) => ({
            day: oh.day_of_week,
            open: oh.open_time,
            close: oh.close_time,
            isOpen: oh.is_open,
          })),
          services: (row.services || []).map((s: any) => ({
            id: s.id,
            salon_id: s.salon_id,
            name: s.name,
            category: s.category,
            description: s.description || "",
            price: Number(s.price),
            durationMinutes: s.duration_minutes || 30,
            image_url: s.image_url,
            popular: s.is_popular,
          })),
          staff: (row.staff || []).map((st: any) => ({
            id: st.id,
            salon_id: st.salon_id,
            name: st.name,
            roleTitle: st.role_title,
            avatar_url: st.avatar_url || "",
            rating: Number(st.rating) || 5.0,
            reviewsCount: st.reviews_count || 0,
            isAvailable: st.is_available,
            specialties: st.specialties || [],
          })),
          amenities: row.amenities || [],
          isVerified: Boolean(row.is_verified),
          status: row.status,
          ownerId: row.owner_id || "",
          currentServingToken: 9,
          activeQueueCount: 3,
          estimatedWaitPerCustomerMinutes: 18,
        }));
      }
    } catch (err) {
      console.warn("Failed to fetch salons from Supabase, falling back to memory DB:", err);
    }
  }

  // Memory DB filter
  let result = [...memoryDb.salons];

  if (params.status) {
    result = result.filter((s) => s.status === params.status);
  }

  if (params.city && params.city !== "All") {
    result = result.filter((s) => s.city.toLowerCase() === params.city!.toLowerCase());
  }

  if (params.category && params.category !== "All") {
    const cat = params.category.toLowerCase();
    result = result.filter((s) =>
      s.services.some(
        (srv) =>
          srv.category.toLowerCase().includes(cat) ||
          srv.name.toLowerCase().includes(cat)
      )
    );
  }

  if (params.search && params.search.trim()) {
    const q = params.search.toLowerCase().trim();
    result = result.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.area.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q) ||
        s.services.some((srv) => srv.name.toLowerCase().includes(q))
    );
  }

  return result;
}

export async function getSalonById(idOrSlug: string): Promise<Salon | null> {
  const salons = await getAllSalons();
  const salon = salons.find((s) => s.id === idOrSlug || s.slug === idOrSlug);
  return salon || null;
}

export async function createSalon(data: Partial<Salon>): Promise<Salon> {
  const id = data.id || `salon_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const slug = data.slug || (data.name ? data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") : id);

  const newSalon: Salon = {
    id,
    slug,
    name: data.name || "Untitled Salon",
    tagline: data.tagline || "Luxury Grooming Experience",
    description: data.description || "A premier grooming salon delivering top-tier style.",
    address: data.address || "Main Street",
    city: data.city || "Mumbai",
    area: data.area || "City Center",
    pincode: data.pincode || "400001",
    latitude: data.latitude || 19.076,
    longitude: data.longitude || 72.8777,
    phone: data.phone || "+91 99999 00000",
    email: data.email || "info@salon.com",
    rating: data.rating || 5.0,
    reviewCount: data.reviewCount || 0,
    bannerImage:
      data.bannerImage ||
      "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=1200&auto=format&fit=crop",
    galleryImages: data.galleryImages || [
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=800&auto=format&fit=crop",
    ],
    startingPrice: data.startingPrice || 500,
    openingHours: data.openingHours || [
      { day: "Monday", open: "09:00", close: "21:00", isOpen: true },
      { day: "Tuesday", open: "09:00", close: "21:00", isOpen: true },
      { day: "Wednesday", open: "09:00", close: "21:00", isOpen: true },
      { day: "Thursday", open: "09:00", close: "21:00", isOpen: true },
      { day: "Friday", open: "09:00", close: "21:00", isOpen: true },
      { day: "Saturday", open: "09:00", close: "22:00", isOpen: true },
      { day: "Sunday", open: "09:00", close: "20:00", isOpen: true },
    ],
    services: data.services || [
      {
        id: `srv_${Date.now()}_1`,
        salon_id: id,
        name: "Signature Haircut & Styling",
        category: "Haircut",
        description: "Precision cut and styling consultation.",
        price: 600,
        durationMinutes: 30,
        popular: true,
      },
    ],
    staff: data.staff || [
      {
        id: `stf_${Date.now()}_1`,
        salon_id: id,
        name: "Master Stylist",
        roleTitle: "Lead Barber",
        avatar_url:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop",
        rating: 5.0,
        reviewsCount: 10,
        isAvailable: true,
        specialties: ["Haircuts", "Beard Styling"],
      },
    ],
    amenities: data.amenities || ["Wi-Fi", "Air Conditioning", "Beverages"],
    isVerified: data.isVerified || false,
    status: data.status || "pending",
    ownerId: data.ownerId || "usr_owner_new",
    currentServingToken: 0,
    activeQueueCount: 0,
    estimatedWaitPerCustomerMinutes: 20,
  };

  // Save to memory DB
  memoryDb.salons = [newSalon, ...memoryDb.salons];
  memoryDb.metrics.totalSalons += 1;
  if (newSalon.status === "pending") {
    memoryDb.metrics.pendingApprovals += 1;
  } else if (newSalon.status === "active") {
    memoryDb.metrics.activeSalons += 1;
  }

  // Also write to Supabase if configured
  const supabase = getServerSupabase();
  if (isServerSupabaseConfigured() && supabase) {
    try {
      await supabase.from("salons").insert({
        id: newSalon.id,
        name: newSalon.name,
        slug: newSalon.slug,
        tagline: newSalon.tagline,
        description: newSalon.description,
        address: newSalon.address,
        city: newSalon.city,
        area: newSalon.area,
        pincode: newSalon.pincode,
        phone: newSalon.phone,
        email: newSalon.email,
        banner_image: newSalon.bannerImage,
        starting_price: newSalon.startingPrice,
        status: newSalon.status,
        is_verified: newSalon.isVerified,
      });
    } catch (e) {
      console.warn("Failed to insert salon into Supabase:", e);
    }
  }

  return newSalon;
}

export async function updateSalon(id: string, patch: Partial<Salon>): Promise<Salon | null> {
  const index = memoryDb.salons.findIndex((s) => s.id === id || s.slug === id);
  if (index === -1) return null;

  const previousStatus = memoryDb.salons[index].status;
  memoryDb.salons[index] = { ...memoryDb.salons[index], ...patch };
  const updated = memoryDb.salons[index];

  // If status changed, update metrics
  if (patch.status && patch.status !== previousStatus) {
    memoryDb.metrics.activeSalons = memoryDb.salons.filter((s) => s.status === "active").length;
    memoryDb.metrics.pendingApprovals = memoryDb.salons.filter((s) => s.status === "pending").length;
  }

  // Sync to Supabase if configured
  const supabase = getServerSupabase();
  if (isServerSupabaseConfigured() && supabase) {
    try {
      const updatePayload: Record<string, any> = {};
      if (patch.name) updatePayload.name = patch.name;
      if (patch.tagline) updatePayload.tagline = patch.tagline;
      if (patch.address) updatePayload.address = patch.address;
      if (patch.phone) updatePayload.phone = patch.phone;
      if (patch.status) updatePayload.status = patch.status;
      if (typeof patch.isVerified === "boolean") updatePayload.is_verified = patch.isVerified;

      if (Object.keys(updatePayload).length > 0) {
        await supabase.from("salons").update(updatePayload).eq("id", updated.id);
      }
    } catch (e) {
      console.warn("Failed to update salon in Supabase:", e);
    }
  }

  return updated;
}
