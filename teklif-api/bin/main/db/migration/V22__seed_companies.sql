INSERT INTO insurance_companies
(id, name, code, is_active, website_url, contact_phone, rating, total_reviews, created_at, updated_at)
VALUES
 ('11111111-1111-1111-1111-111111111111','Eco Sigorta','ECO',true,'https://eco.example','0850 000 0001',4.2,120, now(), now()),
 ('22222222-2222-2222-2222-222222222222','Denge Sigorta','DNG',true,'https://denge.example','0850 000 0002',4.4,95,  now(), now()),
 ('33333333-3333-3333-3333-333333333333','Performans Sigorta','PRF',true,'https://perf.example','0850 000 0003',4.6,210, now(), now()),
 ('44444444-4444-4444-4444-444444444444','Premium Sigorta','PRM',true,'https://premium.example','0850 000 0004',4.8,340, now(), now())
ON CONFLICT (id) DO NOTHING;
