-- =================================================================
-- SALONX: PRODUCTION POSTGRESQL / SUPABASE DATABASE SCHEMA
-- Multi-Salon Booking & Concurrency-Safe Live Queue Platform
-- =================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('customer', 'salon_owner', 'admin')),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CUSTOMER PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.customer_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    favorite_salon_ids UUID[] DEFAULT '{}',
    notification_preferences JSONB DEFAULT '{"sms": true, "email": true, "push": true}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. SALONS TABLE
CREATE TABLE IF NOT EXISTS public.salons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES public.users(id) ON DELETE RESTRICT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    tagline TEXT,
    description TEXT,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    area TEXT NOT NULL,
    pincode TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    rating NUMERIC(3,2) DEFAULT 5.0,
    review_count INTEGER DEFAULT 0,
    banner_image TEXT,
    gallery_images TEXT[] DEFAULT '{}',
    starting_price NUMERIC(10,2) DEFAULT 0,
    amenities TEXT[] DEFAULT '{}',
    is_verified BOOLEAN DEFAULT FALSE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('active', 'pending', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. OPERATING HOURS TABLE
CREATE TABLE IF NOT EXISTS public.operating_hours (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salon_id UUID REFERENCES public.salons(id) ON DELETE CASCADE,
    day_of_week TEXT NOT NULL CHECK (day_of_week IN ('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday')),
    open_time TIME NOT NULL,
    close_time TIME NOT NULL,
    is_open BOOLEAN DEFAULT TRUE,
    UNIQUE(salon_id, day_of_week)
);

-- 5. SALON STAFF / BARBERS TABLE
CREATE TABLE IF NOT EXISTS public.salon_staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salon_id UUID REFERENCES public.salons(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    role_title TEXT NOT NULL,
    avatar_url TEXT,
    rating NUMERIC(3,2) DEFAULT 5.0,
    reviews_count INTEGER DEFAULT 0,
    is_available BOOLEAN DEFAULT TRUE,
    specialties TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. SERVICES TABLE
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salon_id UUID REFERENCES public.salons(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Haircut','Hair Styling','Beard Trimming','Hair Wash','Facial','Hair Coloring','Spa','Treatments','Other')),
    description TEXT,
    price NUMERIC(10,2) NOT NULL,
    duration_minutes INTEGER NOT NULL DEFAULT 30,
    image_url TEXT,
    is_popular BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_code TEXT UNIQUE NOT NULL,
    salon_id UUID REFERENCES public.salons(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    staff_id UUID REFERENCES public.salon_staff(id) ON DELETE SET NULL,
    booking_type TEXT NOT NULL CHECK (booking_type IN ('appointment', 'walk_in')),
    booking_date DATE NOT NULL,
    time_slot TIME,
    total_amount NUMERIC(10,2) NOT NULL,
    total_duration_minutes INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'in_service', 'completed', 'cancelled', 'no_show')),
    queue_token_number INTEGER NOT NULL,
    estimated_wait_minutes INTEGER DEFAULT 0,
    service_started_at TIMESTAMP WITH TIME ZONE,
    service_completed_at TIMESTAMP WITH TIME ZONE,
    cancellation_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. QUEUE TOKENS TABLE (For high-speed concurrency locking & atomic sequences)
CREATE TABLE IF NOT EXISTS public.queue_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salon_id UUID REFERENCES public.salons(id) ON DELETE CASCADE,
    queue_date DATE NOT NULL,
    last_assigned_token INTEGER DEFAULT 0,
    current_serving_token INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(salon_id, queue_date)
);

-- 9. ATOMIC TOKEN GENERATOR FUNCTION (Prevents race conditions)
CREATE OR REPLACE FUNCTION public.generate_atomic_queue_token(
    p_salon_id UUID,
    p_queue_date DATE
)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_token INTEGER;
BEGIN
    INSERT INTO public.queue_tokens (salon_id, queue_date, last_assigned_token, current_serving_token)
    VALUES (p_salon_id, p_queue_date, 1, 0)
    ON CONFLICT (salon_id, queue_date)
    DO UPDATE SET 
        last_assigned_token = public.queue_tokens.last_assigned_token + 1,
        updated_at = NOW()
    RETURNING last_assigned_token INTO v_token;

    RETURN v_token;
END;
$$;

-- 10. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salon_id UUID REFERENCES public.salons(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
    amount NUMERIC(10,2) NOT NULL,
    currency TEXT DEFAULT 'INR',
    payment_method TEXT CHECK (payment_method IN ('upi', 'card', 'cash_at_salon', 'net_banking')),
    status TEXT NOT NULL CHECK (status IN ('pending', 'captured', 'refunded', 'failed')),
    transaction_reference TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. ADMIN SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.admin_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.salons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_profiles ENABLE ROW LEVEL SECURITY;

-- Salons are viewable by anyone if active
CREATE POLICY "Public salons viewable" ON public.salons
    FOR SELECT USING (status = 'active');

-- Salon owners can manage their own salons
CREATE POLICY "Salon owners can edit their salon" ON public.salons
    FOR ALL USING (auth.uid() = owner_id);

-- Customers can view their own bookings
CREATE POLICY "Customers view own bookings" ON public.bookings
    FOR SELECT USING (auth.uid() = customer_id);

-- Salon staff & owners can view bookings for their salon
CREATE POLICY "Salon owners view salon bookings" ON public.bookings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.salons 
            WHERE salons.id = bookings.salon_id AND salons.owner_id = auth.uid()
        )
    );
