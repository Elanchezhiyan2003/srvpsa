/*
# Seed Demo Data (retry)

Populates the database with demo data for TNPSCE Academy.
Fixed: separated record and scalar INTO targets.
*/

-- Batches
INSERT INTO public.batches (name, description, start_date, end_date, status) VALUES
  ('TNPSC Group II A', 'Tamil Nadu History focused preparation batch with weekly mock examinations.', '2026-01-01', '2026-05-28', 'ACTIVE'),
  ('TNPSC Group IV B', 'Indian Polity focused preparation batch with weekly mock examinations.', '2026-02-01', '2026-06-28', 'ACTIVE'),
  ('TNPSC Group II C', 'General Science focused preparation batch with weekly mock examinations.', '2026-03-01', '2026-07-28', 'ACTIVE'),
  ('TNPSC Group IV D', 'Aptitude focused preparation batch with weekly mock examinations.', '2026-04-01', '2026-08-28', 'ACTIVE'),
  ('TNPSC Group II E', 'Current Affairs focused preparation batch with weekly mock examinations.', '2026-05-01', '2026-09-28', 'ACTIVE'),
  ('TNPSC Group IV F', 'Geography focused preparation batch with weekly mock examinations.', '2026-06-01', '2026-10-28', 'ACTIVE'),
  ('TNPSC Group II G', 'Economics focused preparation batch with weekly mock examinations.', '2026-07-01', '2026-11-28', 'ACTIVE'),
  ('TNPSC Group IV H', 'Environment focused preparation batch with weekly mock examinations.', '2026-08-01', '2026-12-28', 'UPCOMING'),
  ('TNPSC Group II I', 'Tamil Nadu History focused preparation batch with weekly mock examinations.', '2026-09-01', '2027-01-28', 'UPCOMING'),
  ('TNPSC Group IV J', 'Indian Polity focused preparation batch with weekly mock examinations.', '2025-06-01', '2025-10-28', 'COMPLETED');

-- Auth users
DO $$
BEGIN
  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, created_at, updated_at,
    confirmation_token, email_change, email_change_token_new, recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    '11111111-1111-1111-1111-111111111111',
    'authenticated', 'authenticated',
    'admin@tnpsce.academy',
    crypt('Password123', gen_salt('bf')),
    now(), now(), now(), '', '', '', ''
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, created_at, updated_at,
    confirmation_token, email_change, email_change_token_new, recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    '22222222-2222-2222-2222-222222222222',
    'authenticated', 'authenticated',
    'student@tnpsce.academy',
    crypt('Password123', gen_salt('bf')),
    now(), now(), now(), '', '', '', ''
  ) ON CONFLICT (id) DO NOTHING;
END $$;

-- Public users
DO $$
DECLARE
  student_user_id uuid;
  batch_c_id uuid;
BEGIN
  SELECT id INTO batch_c_id FROM public.batches WHERE name = 'TNPSC Group II C' LIMIT 1;

  INSERT INTO public.users (auth_id, full_name, email, mobile, role, is_active)
  VALUES ('11111111-1111-1111-1111-111111111111', 'Priya Raman', 'admin@tnpsce.academy', '9876543201', 'SUPER_ADMIN', true);

  INSERT INTO public.users (id, auth_id, full_name, email, mobile, role, is_active)
  VALUES (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', 'Meena Murugan', 'student@tnpsce.academy', '9876543202', 'STUDENT', true)
  RETURNING id INTO student_user_id;

  INSERT INTO public.students (user_id, batch_id, roll_number, joined_at)
  VALUES (student_user_id, batch_c_id, 'TNPSCE0019', '2026-01-19');
END $$;

-- Bulk students (480)
DO $$
DECLARE
  first_names text[] := ARRAY['Aadhira','Arun','Divya','Harish','Janani','Karthik','Lavanya','Madhan','Nithya','Pranav','Rohini','Saravanan','Tharun','Vaishnavi','Yamini','Gokul','Priya','Sanjay','Meena','Vignesh'];
  last_names text[] := ARRAY['Raman','Subramanian','Kumar','Iyer','Krishnan','Rajendran','Murugan','Selvi','Natarajan','Balaji'];
  batch_ids uuid[];
  i int;
  fn text; ln text; bid uuid;
  email_addr text; mobile_num text; roll_num text;
  new_user_id uuid;
BEGIN
  SELECT array_agg(id ORDER BY created_at) INTO batch_ids FROM public.batches;
  FOR i IN 1..480 LOOP
    fn := first_names[1 + ((i - 1) % 20)];
    ln := last_names[1 + (((i - 1) * 3) % 10)];
    bid := batch_ids[1 + ((i - 1) % 10)];
    email_addr := lower(fn) || '.' || lower(ln) || (i + 20)::text || '@tnpsce.academy';
    mobile_num := '9' || substring((600000000 + ((i + 20) * 7919))::text, 1, 9);
    roll_num := 'TNPSCE' || lpad((i + 20)::text, 4, '0');
    CONTINUE WHEN EXISTS (SELECT 1 FROM public.users u WHERE u.email = email_addr);
    INSERT INTO public.users (full_name, email, mobile, role, is_active)
    VALUES (fn || ' ' || ln, email_addr, mobile_num, 'STUDENT', i % 29 != 0)
    RETURNING id INTO new_user_id;
    INSERT INTO public.students (user_id, batch_id, roll_number, joined_at)
    VALUES (new_user_id, bid, roll_num, make_date(2026, 1 + ((i - 1) % 9), 1 + ((i - 1) % 26)));
  END LOOP;
END $$;

-- Exams (50)
DO $$
DECLARE
  subjects text[] := ARRAY['Tamil Nadu History','Indian Polity','General Science','Aptitude','Current Affairs','Geography','Economics','Environment'];
  statuses exam_status[] := ARRAY['PUBLISHED','ACTIVE','DRAFT','CLOSED']::exam_status[];
  i int; qcount int; tmarks int; pmarks int; negmark numeric;
BEGIN
  FOR i IN 1..50 LOOP
    qcount := 20 + ((i - 1) % 4) * 5;
    tmarks := qcount * 2;
    pmarks := round(tmarks * 0.45);
    negmark := CASE WHEN (i - 1) % 3 = 0 THEN 0.25 ELSE 0 END;
    INSERT INTO public.exams (name, description, duration_minutes, total_marks, passing_marks, negative_marks, status, subject, questions_count, published_at, created_at)
    VALUES (
      subjects[1 + ((i - 1) % 8)] || ' Mock Test ' || i,
      'Timed objective examination covering ' || lower(subjects[1 + ((i - 1) % 8)]) || ' for TNPSC aspirants.',
      45 + ((i - 1) % 5) * 15, tmarks, pmarks, negmark,
      statuses[1 + ((i - 1) % 4)], subjects[1 + ((i - 1) % 8)], qcount,
      CASE WHEN statuses[1 + ((i - 1) % 4)] != 'DRAFT' THEN now() ELSE NULL END,
      make_date(2026, 1 + ((i - 1) % 11), 1 + ((i - 1) % 26))
    );
  END LOOP;
END $$;

-- Questions + Options
DO $$
DECLARE
  exam_rec RECORD; qi int; qid uuid; qtype question_type;
  opt_values text[] := ARRAY['Constitutional development and governance','Socio-economic reform movement','Administrative ethics and accountability','Public service delivery model'];
  oi int; is_corr boolean; global_i int;
BEGIN
  global_i := 0;
  FOR exam_rec IN SELECT id, subject, questions_count FROM public.exams ORDER BY created_at LOOP
    FOR qi IN 1..LEAST(20, exam_rec.questions_count) LOOP
      global_i := global_i + 1;
      IF global_i % 9 = 0 THEN qtype := 'MSQ';
      ELSIF global_i % 7 = 0 THEN qtype := 'TRUE_FALSE';
      ELSE qtype := 'MCQ'; END IF;
      qid := gen_random_uuid();
      INSERT INTO public.questions (id, exam_id, type, prompt, subject, explanation, marks, sort_order)
      VALUES (qid, exam_rec.id, qtype,
        'Which statement is most accurate for ' || exam_rec.subject || ' topic ' || qi || '?',
        exam_rec.subject, 'The answer follows the standard TNPSC syllabus interpretation and recent exam pattern.', 2, qi);
      IF qtype = 'TRUE_FALSE' THEN
        INSERT INTO public.options (question_id, label, value, is_correct) VALUES
          (qid, 'A', 'True', global_i % 2 = 0), (qid, 'B', 'False', global_i % 2 != 0);
      ELSE
        FOR oi IN 1..4 LOOP
          IF qtype = 'MSQ' THEN is_corr := oi <= 2; ELSE is_corr := (oi - 1) = (global_i % 4); END IF;
          INSERT INTO public.options (question_id, label, value, is_correct)
          VALUES (qid, substring('ABCD' from oi for 1), opt_values[(global_i + oi - 1) % 4 + 1], is_corr);
        END LOOP;
      END IF;
    END LOOP;
  END LOOP;
END $$;

-- Exam Assignments (14)
DO $$
DECLARE exam_rec RECORD; batch_arr uuid[]; i int := 0;
BEGIN
  SELECT array_agg(id ORDER BY created_at) INTO batch_arr FROM public.batches;
  FOR exam_rec IN SELECT id FROM public.exams ORDER BY created_at LIMIT 14 LOOP
    i := i + 1;
    INSERT INTO public.exam_assignments (exam_id, batch_id, opens_at, closes_at, created_at)
    VALUES (exam_rec.id, batch_arr[1 + ((i - 1) % 10)],
      make_date(2026, 6, i + 1) + time '09:00',
      make_date(2026, 6, i + 2) + time '21:00',
      make_date(2026, 6, i));
  END LOOP;
END $$;

-- Exam Attempts (240)
DO $$
DECLARE
  student_rec RECORD; i int := 0;
  assignment_id uuid; tm int; pm int;
  score numeric; pct numeric; passing_pct numeric;
BEGIN
  FOR student_rec IN SELECT id, batch_id FROM public.students ORDER BY id LIMIT 240 LOOP
    i := i + 1;
    SELECT ea.id, e.total_marks, e.passing_marks INTO assignment_id, tm, pm
    FROM public.exam_assignments ea JOIN public.exams e ON e.id = ea.exam_id
    WHERE ea.batch_id = student_rec.batch_id ORDER BY ea.created_at OFFSET ((i - 1) % 5) LIMIT 1;
    IF assignment_id IS NOT NULL THEN
      score := 28 + ((i * 13) % tm);
      score := LEAST(score, tm); score := GREATEST(score, 14);
      pct := round((score / tm) * 100);
      passing_pct := round((pm::numeric / tm) * 100);
      INSERT INTO public.exam_attempts (assignment_id, student_id, status, started_at, submitted_at, score, percentage, rank_num, passed)
      VALUES (assignment_id, student_rec.id, 'EVALUATED',
        now() - interval '2 hours', now() - interval '1 hour', score, pct, i, pct >= passing_pct);
    END IF;
  END LOOP;
END $$;

-- Activity Logs
DO $$
DECLARE admin_id uuid;
BEGIN
  SELECT id INTO admin_id FROM public.users WHERE email = 'admin@tnpsce.academy';
  INSERT INTO public.activity_logs (actor_id, message, metadata, created_at) VALUES
    (admin_id, 'Published Indian Polity Mock Test 18', '{"tone": "success"}', now() - interval '10 minutes'),
    (admin_id, 'CSV upload validated 86 student records', '{"tone": "neutral"}', now() - interval '34 minutes'),
    (admin_id, 'Assigned Aptitude Mock Test 12 to Group IV D', '{"tone": "warning"}', now() - interval '1 hour'),
    (admin_id, 'Network warning detected for 3 active attempts', '{"tone": "danger"}', now() - interval '2 hours');
END $$;

-- Announcements
INSERT INTO public.announcements (title, body, date) VALUES
  ('June weekly mock schedule published', 'Group II and Group IV batches have new weekend practice tests.', '2026-06-12'),
  ('Current affairs revision window', 'Students can review May and June current affairs modules before the next exam.', '2026-06-10');
