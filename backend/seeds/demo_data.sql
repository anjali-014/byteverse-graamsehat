-- Demo ASHA workers
INSERT INTO asha_workers (id, name, phone, village, block) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Sunita Devi',   '9876543210', 'Bihta Ward 4',  'Bihta'),
  ('a1000000-0000-0000-0000-000000000002', 'Meena Kumari',  '9876543211', 'Naubatpur',     'Bihta'),
  ('a1000000-0000-0000-0000-000000000003', 'Rekha Sharma',  '9876543212', 'Maner',         'Bihta')
ON CONFLICT DO NOTHING;

-- Demo facilities
INSERT INTO facilities (name, type, block, lat, lng, phone) VALUES
  ('PHC Bihta',         'PHC', 'Bihta', 25.5616, 85.1203, '0612-2298001'),
  ('CHC Naubatpur',     'CHC', 'Bihta', 25.5901, 85.0834, '0612-2298002'),
  ('PHC Maner',         'PHC', 'Bihta', 25.6543, 84.8762, '0612-2298003'),
  ('District Hospital', 'DH',  'Bihta', 25.5941, 85.1376, '0612-2200300')
ON CONFLICT DO NOTHING;

-- Demo triage cases (mix of results for dashboard)
INSERT INTO triage_cases
  (id, asha_id, patient_age_group, patient_sex, is_pregnant,
   symptoms, triage_result, confidence_score, village_tag,
   client_timestamp, input_method)
VALUES
  ('c1000000-0000-0000-0000-000000000001',
   'a1000000-0000-0000-0000-000000000001',
   'child','F',false,
   '["fever","stiff_neck","headache"]','RED',0.91,'Bihta Ward 4',
   EXTRACT(EPOCH FROM NOW()-INTERVAL '2 hours')*1000,'tap'),

  ('c1000000-0000-0000-0000-000000000002',
   'a1000000-0000-0000-0000-000000000002',
   'infant','M',false,
   '["fever","not_eating","sunken_eyes"]','RED',0.87,'Naubatpur',
   EXTRACT(EPOCH FROM NOW()-INTERVAL '5 hours')*1000,'voice'),

  ('c1000000-0000-0000-0000-000000000003',
   'a1000000-0000-0000-0000-000000000003',
   'adult','F',true,
   '["fever","body_ache"]','YELLOW',0.74,'Maner',
   EXTRACT(EPOCH FROM NOW()-INTERVAL '8 hours')*1000,'tap'),

  ('c1000000-0000-0000-0000-000000000004',
   'a1000000-0000-0000-0000-000000000001',
   'adult','M',false,
   '["cough","cold"]','GREEN',0.83,'Bihta Ward 4',
   EXTRACT(EPOCH FROM NOW()-INTERVAL '12 hours')*1000,'tap')
ON CONFLICT DO NOTHING;