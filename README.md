# SalonX – Multi-Salon Booking & Live Queue Platform

> **"Your Style. Your Time. Zero Waiting."**

SalonX is an international, enterprise-grade, multi-salon booking platform and real-time live queue management system built with Next.js 14, TypeScript, Tailwind CSS, and Supabase / PostgreSQL.

---

## 🌟 Brand & Visual Identity
- **Primary Background**: Deep Black (`#0B0B0D`)
- **Secondary Background**: Charcoal (`#171719`)
- **Luxury Gold Accents**: (`#D4AF37`, `#BFA15F`, `#F3E5AB`)
- **Typography**: Precision, clean letter-spacing, modern sans-serif
- **Mobile First**: Built with responsive layouts and a persistent mobile bottom navigation bar (`Home`, `Explore`, `Bookings`, `Queue`, `Profile`).

---

## 🚀 Key Modules Built

### 1. Customer Website & Landing Page (`/`)
- High-impact luxury hero section with atmospheric gold glow and dark overlay.
- Search and filter dock: Filter by city, service category, keywords, price, and distance.
- Featured salons grid with live queue tokens, ratings, and instant booking triggers.
- Interactive live queue showcase card simulating `#09 Now Serving`, `#12 Your Token`, and dynamic wait estimation.
- 3-step visual guide on "How It Works".

### 2. Salon Discovery & Filtering (`/salons` & `/salons/[id]`)
- Multi-dimensional filter sidebar (City, Category, Minimum Rating, Price slider, Keyword search).
- Detailed salon profiles featuring photo galleries, master barber rosters, full service menus with duration weights, operating hours, client reviews, and direct booking links.

### 3. Complete 6-Step Booking Flow (`/book`)
- **Step 1**: Choose luxury atelier / salon.
- **Step 2**: Select multiple services (Haircut, Beard sculpting, Japanese head spa, Charcoal facial, etc.).
- **Step 3**: Select preferred master barber or "First Available" for fastest chair time.
- **Step 4**: Choose visit date and select either **Live Walk-In Queue** or **Reserved Time Slot**.
- **Step 5**: Review visit summary, enter client details, and choose payment preference.
- **Step 6**: Instant confirmation with confetti animation, unique booking code (`SX-XXXX`), and atomic queue token number.

### 4. Real-Time Live Queue Management System (`/queue`)
- **Core Value Proposition**:
  - `YOUR TOKEN: #12`
  - `NOW SERVING: #09`
  - `CUSTOMERS AHEAD: 3`
  - `ESTIMATED WAITING TIME: 25 MINUTES` (dynamically calculated based on barber count, active workloads, and service duration)
  - `QUEUE STATUS: CONFIRMED / IN SERVICE`
  - Real-time animated progress indicator
  - Interactive "Simulate Advance Queue" button to test real-time state changes on the fly.
  - Multi-token selector and booking code lookup.

### 5. Salon Owner Dashboard (`/owner`)
- Real-time floor queue controller:
  - View all waiting tokens
  - **Start Service** (marks in-chair, updates now-serving token across all clients)
  - **Mark Completed** (advances the queue)
  - **Skip / Cancel Token** with mandatory logged reason
- Real-time operational metrics: Today's bookings, active queue count, current chair, completed visits, cancellations, today's revenue.
- **Add Walk-In Client Modal**: Instantly enters walk-ins at the front desk with concurrency-safe token generation.
- Full booking history and audit trail.
- Staff & barber availability toggles (Available / On Break).
- Atelier profile and contact settings editor.

### 6. Super Admin Dashboard (`/admin`)
- Centralized multi-salon governance.
- **Pending Approvals Queue**: Review, approve, or reject new salon registrations.
- Verified salon directory & queue status monitor.
- User management across customers, salon owners, and admins.
- Dynamic platform commission rate slider (e.g. 15%) and revenue projections.
- "Reset Demo Data" trigger to restore initial state at any time.

### 7. Partner Registration Portal (`/become-partner`)
- Comprehensive onboarding application for new salon owners and master barbers.
- Seamlessly submits applications into the Super Admin approval pipeline.

---

## 🗄️ Database Architecture & Supabase Integration
Full SQL migration scripts and seed data are included in:
- `supabase/schema.sql`
- `supabase/seed.sql`

### Tables Included:
1. `users`
2. `customer_profiles`
3. `salons`
4. `operating_hours`
5. `salon_staff`
6. `services`
7. `bookings`
8. `queue_tokens` (with atomic concurrency lock)
9. `reviews`
10. `payments`
11. `notifications`
12. `admin_settings`

### Concurrency-Safe Queue Token Generator (PostgreSQL Function):
```sql
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
```

---

## 🧪 Testing Instructions

### Start Development Server:
```bash
npm run dev
```

### Try Testing Personas:
Use the **"Persona Switcher"** in the top navigation bar to switch between:
1. **Customer View** (`Alexander Wright`) - Explore salons, book appointments, track token `#12` in the live queue.
2. **Salon Owner View** (`Marcus Vance`) - Access `/owner`, advance token `#09` to "Completed", start token `#10`, or add a new walk-in client.
3. **Super Admin View** (`Victoria Sterling`) - Access `/admin`, review pending salon applications, adjust platform commission, and inspect analytics.
