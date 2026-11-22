-- =================================================================
-- SALONX SUPABASE SEED DATA
-- =================================================================

-- Insert sample users
INSERT INTO public.users (id, email, phone, name, role, avatar_url)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'alexander@salonx.luxury', '+91 98765 43210', 'Alexander Wright', 'customer', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop'),
    ('22222222-2222-2222-2222-222222222222', 'marcus@royalcrown.com', '+91 98220 11223', 'Marcus Vance', 'salon_owner', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop'),
    ('33333333-3333-3333-3333-333333333333', 'admin@salonx.luxury', '+91 99000 88776', 'Victoria Sterling', 'admin', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop')
ON CONFLICT (email) DO NOTHING;

-- Insert flagship salon: The Royal Crown Barber & Lounge
INSERT INTO public.salons (
    id, owner_id, name, slug, tagline, description, address, city, area, pincode,
    latitude, longitude, phone, email, rating, review_count, banner_image, starting_price, is_verified, status
)
VALUES (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '22222222-2222-2222-2222-222222222222',
    'The Royal Crown Barber & Lounge',
    'royal-crown-barber',
    'Quintessential British Barbering & Bespoke Grooming',
    'The Royal Crown delivers an unmatched bespoke gentleman’s grooming sanctuary. Featuring vintage Italian Belmont leather chairs, handcrafted oak fittings, hot lather straight-razor shaving, and precision shear haircuts by certified master barbers.',
    '42 Heritage Boulevard, Bandra West',
    'Mumbai',
    'Bandra West',
    '400050',
    19.0596,
    72.8295,
    '+91 22 2640 1888',
    'concierge@royalcrown.com',
    4.9,
    348,
    'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=1200&auto=format&fit=crop',
    650,
    TRUE,
    'active'
)
ON CONFLICT (slug) DO NOTHING;

-- Insert master barbers
INSERT INTO public.salon_staff (id, salon_id, name, role_title, avatar_url, rating, reviews_count, is_available, specialties)
VALUES
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Marcus Vance', 'Master Barber & Founder', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop', 4.98, 182, TRUE, ARRAY['Classic Executive Cut', 'Royal Razor Shave']),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Julian Thorne', 'Senior Stylist', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=300&auto=format&fit=crop', 4.88, 94, TRUE, ARRAY['Skin Fades', 'Textured Crop']),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Dario Rossi', 'Grooming Specialist', 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=300&auto=format&fit=crop', 4.91, 72, TRUE, ARRAY['Charcoal Detox Facial', 'Scalp Rejuvenation'])
ON CONFLICT DO NOTHING;

-- Insert services
INSERT INTO public.services (id, salon_id, name, category, description, price, duration_minutes, is_popular)
VALUES
    ('cccccccc-cccc-cccc-cccc-ccccccccccc1', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Signature Royal Haircut & Finish', 'Haircut', 'Full consultation, precision shear cut, invigorating tea tree scalp wash, hot towel neck shave and bespoke styling.', 850, 40, TRUE),
    ('cccccccc-cccc-cccc-cccc-ccccccccccc2', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Traditional Hot Lather Straight-Razor Shave', 'Beard Trimming', 'Multi-step pre-shave essential oils, double hot-steam towel wrap, badger hair brush lather, straight razor glide, and chilled alum block finish.', 650, 30, TRUE),
    ('cccccccc-cccc-cccc-cccc-ccccccccccc3', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Gentleman’s Charcoal Detox Facial', 'Facial', 'Ultrasonic deep pore extraction, volcanic charcoal mask, jade stone lymphatic facial massage.', 1200, 45, TRUE)
ON CONFLICT DO NOTHING;

-- Initialize today's queue sequence
INSERT INTO public.queue_tokens (salon_id, queue_date, last_assigned_token, current_serving_token)
VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', CURRENT_DATE, 12, 9)
ON CONFLICT (salon_id, queue_date) DO UPDATE
SET last_assigned_token = 12, current_serving_token = 9;
