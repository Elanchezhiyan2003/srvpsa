/*
# TNPSCE Academy Full Database Schema

## Overview
Complete database schema for the TNPSCE Academy Examination Platform — a batch-based
online examination system with admin and student portals.

## New Tables
1. `users` — Platform users (admins and students). Links to Supabase auth.users via auth_id.
   - id (uuid, PK), auth_id (uuid, FK → auth.users), full_name, email, mobile, role (enum), is_active, created_at, updated_at

2. `batches` — Student groupings by exam track.
   - id (uuid, PK), name, description, start_date, end_date, status (enum), created_at, updated_at

3. `students` — Student profile linked to a user and batch.
   - id (uuid, PK), user_id (FK → users), batch_id (FK → batches), roll_number (unique), joined_at

4. `exams` — Exam definitions with marks, duration, and subject.
   - id (uuid, PK), name, description, duration_minutes, total_marks, passing_marks, negative_marks, status (enum), subject, questions_count, published_at, created_at, updated_at

5. `questions` — Individual questions belonging to an exam.
   - id (uuid, PK), exam_id (FK → exams), type (enum), prompt, subject, explanation, marks, sort_order

6. `options` — Answer options for each question.
   - id (uuid, PK), question_id (FK → questions), label, value, is_correct

7. `exam_assignments` — Links an exam to a batch with open/close window.
   - id (uuid, PK), exam_id (FK → exams), batch_id (FK → batches), opens_at, closes_at, created_at
   - UNIQUE constraint on (exam_id, batch_id)

8. `exam_attempts` — Student attempt record for an assigned exam.
   - id (uuid, PK), assignment_id (FK → exam_assignments), student_id (FK → students), status (enum), started_at, submitted_at, score, percentage, rank_num, passed
   - UNIQUE constraint on (assignment_id, student_id)

9. `attempt_answers` — Individual answers within an attempt.
   - id (uuid, PK), attempt_id (FK → exam_attempts), question_id (FK → questions), option_ids (text[]), is_marked, is_correct

10. `activity_logs` — Audit trail of admin actions.
    - id (uuid, PK), actor_id (FK → users), message, metadata (jsonb), created_at

11. `announcements` — Platform-wide announcements.
    - id (uuid, PK), title, body, date

## Security (RLS)
- ALL tables have RLS enabled.
- `is_admin()` helper checks if auth.uid() maps to an admin user.
- Admin policies: full CRUD on all tables.
- Student policies: read own profile/attempt/answers; read assigned exams/batches/questions/options.
- All policies require authenticated role.

## Enums
- role_enum: SUPER_ADMIN, ADMIN, STUDENT
- batch_status: UPCOMING, ACTIVE, COMPLETED, ARCHIVED
- exam_status: DRAFT, PUBLISHED, ACTIVE, CLOSED
- question_type: MCQ, MSQ, TRUE_FALSE
- attempt_status: NOT_STARTED, IN_PROGRESS, SUBMITTED, EVALUATED
*/

-- ============================================================
-- ENUMS
-- ============================================================
DO $$ BEGIN
  CREATE TYPE role_enum AS ENUM ('SUPER_ADMIN', 'ADMIN', 'STUDENT');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE batch_status AS ENUM ('UPCOMING', 'ACTIVE', 'COMPLETED', 'ARCHIVED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE exam_status AS ENUM ('DRAFT', 'PUBLISHED', 'ACTIVE', 'CLOSED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE question_type AS ENUM ('MCQ', 'MSQ', 'TRUE_FALSE');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE attempt_status AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'SUBMITTED', 'EVALUATED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============================================================
-- TABLES (order matters for foreign keys)
-- ============================================================

-- Users (no FK to public tables, references auth.users only)
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id uuid UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text UNIQUE NOT NULL,
  mobile text,
  role role_enum NOT NULL DEFAULT 'STUDENT',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Batches (standalone, no FK to users)
CREATE TABLE IF NOT EXISTS public.batches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  start_date date NOT NULL,
  end_date date NOT NULL,
  status batch_status NOT NULL DEFAULT 'ACTIVE',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_batches_status ON public.batches(status);

-- Students (references users + batches)
CREATE TABLE IF NOT EXISTS public.students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  batch_id uuid NOT NULL REFERENCES public.batches(id),
  roll_number text UNIQUE NOT NULL,
  joined_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_students_batch_id ON public.students(batch_id);

-- Exams (standalone)
CREATE TABLE IF NOT EXISTS public.exams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  duration_minutes int NOT NULL,
  total_marks int NOT NULL,
  passing_marks int NOT NULL,
  negative_marks numeric NOT NULL DEFAULT 0,
  status exam_status NOT NULL DEFAULT 'DRAFT',
  subject text NOT NULL,
  questions_count int NOT NULL DEFAULT 0,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_exams_status ON public.exams(status);

-- Questions (references exams)
CREATE TABLE IF NOT EXISTS public.questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id uuid NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
  type question_type NOT NULL,
  prompt text NOT NULL,
  subject text NOT NULL,
  explanation text,
  marks int NOT NULL DEFAULT 1,
  sort_order int NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_questions_exam_order ON public.questions(exam_id, sort_order);

-- Options (references questions)
CREATE TABLE IF NOT EXISTS public.options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  label text NOT NULL,
  value text NOT NULL,
  is_correct boolean NOT NULL DEFAULT false
);

-- Exam Assignments (references exams + batches)
CREATE TABLE IF NOT EXISTS public.exam_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id uuid NOT NULL REFERENCES public.exams(id),
  batch_id uuid NOT NULL REFERENCES public.batches(id),
  opens_at timestamptz NOT NULL,
  closes_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (exam_id, batch_id)
);
CREATE INDEX IF NOT EXISTS idx_assignments_window ON public.exam_assignments(opens_at, closes_at);

-- Exam Attempts (references exam_assignments + students)
CREATE TABLE IF NOT EXISTS public.exam_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id uuid NOT NULL REFERENCES public.exam_assignments(id),
  student_id uuid NOT NULL REFERENCES public.students(id),
  status attempt_status NOT NULL DEFAULT 'NOT_STARTED',
  started_at timestamptz,
  submitted_at timestamptz,
  score numeric NOT NULL DEFAULT 0,
  percentage numeric NOT NULL DEFAULT 0,
  rank_num int,
  passed boolean NOT NULL DEFAULT false,
  UNIQUE (assignment_id, student_id)
);

-- Attempt Answers (references exam_attempts + questions)
CREATE TABLE IF NOT EXISTS public.attempt_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id uuid NOT NULL REFERENCES public.exam_attempts(id) ON DELETE CASCADE,
  question_id uuid NOT NULL REFERENCES public.questions(id),
  option_ids text[] NOT NULL DEFAULT '{}',
  is_marked boolean NOT NULL DEFAULT false,
  is_correct boolean
);

-- Activity Logs (references users)
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid NOT NULL REFERENCES public.users(id),
  message text NOT NULL,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Announcements (standalone)
CREATE TABLE IF NOT EXISTS public.announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text NOT NULL,
  date date NOT NULL DEFAULT current_date
);

-- ============================================================
-- HELPER FUNCTION (after tables exist)
-- ============================================================
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE auth_id = auth.uid()
    AND role IN ('SUPER_ADMIN', 'ADMIN')
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admin_crud_users" ON public.users;
CREATE POLICY "admin_crud_users" ON public.users FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
DROP POLICY IF EXISTS "student_read_own_user" ON public.users;
CREATE POLICY "student_read_own_user" ON public.users FOR SELECT TO authenticated USING (auth_id = auth.uid());
DROP POLICY IF EXISTS "student_update_own_user" ON public.users;
CREATE POLICY "student_update_own_user" ON public.users FOR UPDATE TO authenticated USING (auth_id = auth.uid()) WITH CHECK (auth_id = auth.uid());

-- Batches
ALTER TABLE public.batches ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admin_crud_batches" ON public.batches;
CREATE POLICY "admin_crud_batches" ON public.batches FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
DROP POLICY IF EXISTS "student_read_batches" ON public.batches;
CREATE POLICY "student_read_batches" ON public.batches FOR SELECT TO authenticated USING (true);

-- Students
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admin_crud_students" ON public.students;
CREATE POLICY "admin_crud_students" ON public.students FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
DROP POLICY IF EXISTS "student_read_own_student" ON public.students;
CREATE POLICY "student_read_own_student" ON public.students FOR SELECT TO authenticated USING (user_id = (SELECT id FROM public.users WHERE auth_id = auth.uid()));

-- Exams
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admin_crud_exams" ON public.exams;
CREATE POLICY "admin_crud_exams" ON public.exams FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
DROP POLICY IF EXISTS "student_read_published_exams" ON public.exams;
CREATE POLICY "student_read_published_exams" ON public.exams FOR SELECT TO authenticated USING (status IN ('PUBLISHED', 'ACTIVE', 'CLOSED'));

-- Questions
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admin_crud_questions" ON public.questions;
CREATE POLICY "admin_crud_questions" ON public.questions FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
DROP POLICY IF EXISTS "student_read_questions" ON public.questions;
CREATE POLICY "student_read_questions" ON public.questions FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.exams WHERE exams.id = questions.exam_id AND exams.status IN ('PUBLISHED','ACTIVE','CLOSED')));

-- Options
ALTER TABLE public.options ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admin_crud_options" ON public.options;
CREATE POLICY "admin_crud_options" ON public.options FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
DROP POLICY IF EXISTS "student_read_options" ON public.options;
CREATE POLICY "student_read_options" ON public.options FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.questions q
    JOIN public.exams e ON e.id = q.exam_id
    WHERE q.id = options.question_id AND e.status IN ('PUBLISHED','ACTIVE','CLOSED')
  ));

-- Exam Assignments
ALTER TABLE public.exam_assignments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admin_crud_assignments" ON public.exam_assignments;
CREATE POLICY "admin_crud_assignments" ON public.exam_assignments FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
DROP POLICY IF EXISTS "student_read_own_assignments" ON public.exam_assignments;
CREATE POLICY "student_read_own_assignments" ON public.exam_assignments FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.students s
    WHERE s.batch_id = exam_assignments.batch_id
    AND s.user_id = (SELECT id FROM public.users WHERE auth_id = auth.uid())
  ));

-- Exam Attempts
ALTER TABLE public.exam_attempts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admin_crud_attempts" ON public.exam_attempts;
CREATE POLICY "admin_crud_attempts" ON public.exam_attempts FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
DROP POLICY IF EXISTS "student_read_own_attempts" ON public.exam_attempts;
CREATE POLICY "student_read_own_attempts" ON public.exam_attempts FOR SELECT TO authenticated
  USING (student_id = (SELECT id FROM public.students WHERE user_id = (SELECT id FROM public.users WHERE auth_id = auth.uid())));
DROP POLICY IF EXISTS "student_insert_own_attempt" ON public.exam_attempts;
CREATE POLICY "student_insert_own_attempt" ON public.exam_attempts FOR INSERT TO authenticated
  WITH CHECK (student_id = (SELECT id FROM public.students WHERE user_id = (SELECT id FROM public.users WHERE auth_id = auth.uid())));
DROP POLICY IF EXISTS "student_update_own_attempt" ON public.exam_attempts;
CREATE POLICY "student_update_own_attempt" ON public.exam_attempts FOR UPDATE TO authenticated
  USING (student_id = (SELECT id FROM public.students WHERE user_id = (SELECT id FROM public.users WHERE auth_id = auth.uid())))
  WITH CHECK (student_id = (SELECT id FROM public.students WHERE user_id = (SELECT id FROM public.users WHERE auth_id = auth.uid())));

-- Attempt Answers
ALTER TABLE public.attempt_answers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admin_crud_attempt_answers" ON public.attempt_answers;
CREATE POLICY "admin_crud_attempt_answers" ON public.attempt_answers FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
DROP POLICY IF EXISTS "student_read_own_answers" ON public.attempt_answers;
CREATE POLICY "student_read_own_answers" ON public.attempt_answers FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.exam_attempts ea
    WHERE ea.id = attempt_answers.attempt_id
    AND ea.student_id = (SELECT id FROM public.students WHERE user_id = (SELECT id FROM public.users WHERE auth_id = auth.uid()))
  ));
DROP POLICY IF EXISTS "student_insert_own_answers" ON public.attempt_answers;
CREATE POLICY "student_insert_own_answers" ON public.attempt_answers FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.exam_attempts ea
    WHERE ea.id = attempt_answers.attempt_id
    AND ea.student_id = (SELECT id FROM public.students WHERE user_id = (SELECT id FROM public.users WHERE auth_id = auth.uid()))
  ));
DROP POLICY IF EXISTS "student_update_own_answers" ON public.attempt_answers;
CREATE POLICY "student_update_own_answers" ON public.attempt_answers FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.exam_attempts ea
    WHERE ea.id = attempt_answers.attempt_id
    AND ea.student_id = (SELECT id FROM public.students WHERE user_id = (SELECT id FROM public.users WHERE auth_id = auth.uid()))
  ));

-- Activity Logs
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admin_crud_activity_logs" ON public.activity_logs;
CREATE POLICY "admin_crud_activity_logs" ON public.activity_logs FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- Announcements
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admin_crud_announcements" ON public.announcements;
CREATE POLICY "admin_crud_announcements" ON public.announcements FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
DROP POLICY IF EXISTS "student_read_announcements" ON public.announcements;
CREATE POLICY "student_read_announcements" ON public.announcements FOR SELECT TO authenticated USING (true);

-- ============================================================
-- TRIGGER: auto-update updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_users_updated_at ON public.users;
CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_batches_updated_at ON public.batches;
CREATE TRIGGER trg_batches_updated_at BEFORE UPDATE ON public.batches FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_exams_updated_at ON public.exams;
CREATE TRIGGER trg_exams_updated_at BEFORE UPDATE ON public.exams FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- VIEWS
-- ============================================================

-- student_detail: joins students + users + batches
CREATE OR REPLACE VIEW public.student_detail AS
  SELECT
    s.id AS student_id,
    u.id AS user_id,
    u.full_name,
    u.email,
    u.mobile,
    u.role,
    u.is_active,
    b.id AS batch_id,
    b.name AS batch_name,
    s.roll_number,
    s.joined_at,
    u.created_at
  FROM public.students s
  JOIN public.users u ON u.id = s.user_id
  JOIN public.batches b ON b.id = s.batch_id;

-- assignment_detail: joins assignments + exams + batches with computed status
CREATE OR REPLACE VIEW public.assignment_detail AS
  SELECT
    ea.id AS assignment_id,
    ea.exam_id,
    e.name AS exam_name,
    ea.batch_id,
    b.name AS batch_name,
    (SELECT count(*) FROM public.students s WHERE s.batch_id = b.id) AS students_count,
    ea.opens_at,
    ea.closes_at,
    ea.created_at AS assigned_date,
    e.duration_minutes,
    e.total_marks,
    e.questions_count,
    CASE
      WHEN now() < ea.opens_at THEN 'Scheduled'
      WHEN now() BETWEEN ea.opens_at AND ea.closes_at THEN 'Live'
      ELSE 'Closed'
    END AS status
  FROM public.exam_assignments ea
  JOIN public.exams e ON e.id = ea.exam_id
  JOIN public.batches b ON b.id = ea.batch_id;
