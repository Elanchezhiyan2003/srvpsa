# TNPSCE Academy — Supabase Database Schema

## Overview

The TNPSCE Academy Examination Platform uses Supabase (PostgreSQL) as its backend. The schema supports batch-based online examinations with admin and student portals, including exam creation, assignment, attempt tracking, and analytics.

## Entity Relationship Diagram

```
auth.users ──1:1──> public.users ──1:1──> students ──M:N──> batches
                                                     │
                                                     └──> exam_attempts ──> attempt_answers
                                                              │
batches ──> exam_assignments <── exams ──> questions ──> options  │
                                                              │
public.users (admin) ──> activity_logs                         │
                                                              └── assignment_detail (view)
announcements (standalone)

student_detail (view) ── joins students + users + batches
```

## Tables

### `users`
Platform users — admins and students. Linked to Supabase Auth via `auth_id`.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK, default `gen_random_uuid()` | Internal user ID |
| `auth_id` | uuid | UNIQUE, FK → `auth.users(id)` ON DELETE CASCADE | Supabase Auth user reference |
| `full_name` | text | NOT NULL | Display name |
| `email` | text | UNIQUE, NOT NULL | Login email |
| `mobile` | text | nullable | Indian mobile number |
| `role` | `role_enum` | NOT NULL, default `'STUDENT'` | SUPER_ADMIN / ADMIN / STUDENT |
| `is_active` | boolean | NOT NULL, default `true` | Account status |
| `created_at` | timestamptz | NOT NULL, default `now()` | Creation timestamp |
| `updated_at` | timestamptz | NOT NULL, default `now()` | Last update (auto-trigger) |

**RLS Policies:**
- `admin_crud_users`: Admin full CRUD
- `student_read_own_user`: Students read own row (`auth_id = auth.uid()`)
- `student_update_own_user`: Students update own row

---

### `batches`
Student groupings by exam track and schedule.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK | |
| `name` | text | NOT NULL | e.g. "TNPSC Group II A" |
| `description` | text | nullable | Batch description |
| `start_date` | date | NOT NULL | Start of batch period |
| `end_date` | date | NOT NULL | End of batch period |
| `status` | `batch_status` | NOT NULL, default `'ACTIVE'` | UPCOMING / ACTIVE / COMPLETED / ARCHIVED |
| `created_at` | timestamptz | NOT NULL, default `now()` | |
| `updated_at` | timestamptz | NOT NULL, default `now()` | Auto-trigger |

**Indexes:** `idx_batches_status` on `status`

**RLS Policies:**
- `admin_crud_batches`: Admin full CRUD
- `student_read_batches`: All authenticated users can read batches

---

### `students`
Student profile linked to a user and assigned batch.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK | |
| `user_id` | uuid | UNIQUE, FK → `users(id)` ON DELETE CASCADE | One-to-one with users |
| `batch_id` | uuid | FK → `batches(id)`, NOT NULL | Current batch assignment |
| `roll_number` | text | UNIQUE, NOT NULL | e.g. "TNPSCE0001" |
| `joined_at` | timestamptz | NOT NULL, default `now()` | Enrollment date |

**Indexes:** `idx_students_batch_id` on `batch_id`

**RLS Policies:**
- `admin_crud_students`: Admin full CRUD
- `student_read_own_student`: Students read own row

---

### `exams`
Exam definitions with marks, duration, subject, and lifecycle status.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK | |
| `name` | text | NOT NULL | e.g. "Indian Polity Mock Test 18" |
| `description` | text | nullable | Exam description |
| `duration_minutes` | int | NOT NULL | Time limit in minutes |
| `total_marks` | int | NOT NULL | Maximum possible score |
| `passing_marks` | int | NOT NULL | Minimum to pass |
| `negative_marks` | numeric | NOT NULL, default `0` | Penalty per wrong answer |
| `status` | `exam_status` | NOT NULL, default `'DRAFT'` | DRAFT / PUBLISHED / ACTIVE / CLOSED |
| `subject` | text | NOT NULL | Subject area |
| `questions_count` | int | NOT NULL, default `0` | Denormalized question count |
| `published_at` | timestamptz | nullable | When exam was published |
| `created_at` | timestamptz | NOT NULL, default `now()` | |
| `updated_at` | timestamptz | NOT NULL, default `now()` | Auto-trigger |

**Indexes:** `idx_exams_status` on `status`

**RLS Policies:**
- `admin_crud_exams`: Admin full CRUD
- `student_read_published_exams`: Students read published/active/closed exams only

---

### `questions`
Individual questions belonging to an exam.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK | |
| `exam_id` | uuid | FK → `exams(id)` ON DELETE CASCADE, NOT NULL | Parent exam |
| `type` | `question_type` | NOT NULL | MCQ / MSQ / TRUE_FALSE |
| `prompt` | text | NOT NULL | Question text |
| `subject` | text | NOT NULL | Subject (matches exam) |
| `explanation` | text | nullable | Answer explanation |
| `marks` | int | NOT NULL, default `1` | Points for correct answer |
| `sort_order` | int | NOT NULL, default `0` | Display order within exam |

**Indexes:** `idx_questions_exam_order` on `(exam_id, sort_order)`

**RLS Policies:**
- `admin_crud_questions`: Admin full CRUD
- `student_read_questions`: Students read questions of published/active/closed exams

---

### `options`
Answer options for each question.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK | |
| `question_id` | uuid | FK → `questions(id)` ON DELETE CASCADE, NOT NULL | Parent question |
| `label` | text | NOT NULL | e.g. "A", "B", "C", "D" |
| `value` | text | NOT NULL | Option text |
| `is_correct` | boolean | NOT NULL, default `false` | Correct answer flag |

**RLS Policies:**
- `admin_crud_options`: Admin full CRUD
- `student_read_options`: Students read options of published/active/closed exam questions

---

### `exam_assignments`
Links an exam to a batch with scheduling window.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK | |
| `exam_id` | uuid | FK → `exams(id)`, NOT NULL | Assigned exam |
| `batch_id` | uuid | FK → `batches(id)`, NOT NULL | Target batch |
| `opens_at` | timestamptz | NOT NULL | When exam becomes available |
| `closes_at` | timestamptz | NOT NULL | When exam closes |
| `created_at` | timestamptz | NOT NULL, default `now()` | Assignment timestamp |

**Constraints:** `UNIQUE (exam_id, batch_id)` — one assignment per exam-batch pair

**Indexes:** `idx_assignments_window` on `(opens_at, closes_at)`

**RLS Policies:**
- `admin_crud_assignments`: Admin full CRUD
- `student_read_own_assignments`: Students read assignments for their batch

---

### `exam_attempts`
Student attempt record for an assigned exam.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK | |
| `assignment_id` | uuid | FK → `exam_assignments(id)`, NOT NULL | Parent assignment |
| `student_id` | uuid | FK → `students(id)`, NOT NULL | Attempting student |
| `status` | `attempt_status` | NOT NULL, default `'NOT_STARTED'` | NOT_STARTED / IN_PROGRESS / SUBMITTED / EVALUATED |
| `started_at` | timestamptz | nullable | When student started |
| `submitted_at` | timestamptz | nullable | When student submitted |
| `score` | numeric | NOT NULL, default `0` | Raw score |
| `percentage` | numeric | NOT NULL, default `0` | Score as percentage |
| `rank_num` | int | nullable | Rank within batch |
| `passed` | boolean | NOT NULL, default `false` | Pass/fail determination |

**Constraints:** `UNIQUE (assignment_id, student_id)` — one attempt per student per assignment

**RLS Policies:**
- `admin_crud_attempts`: Admin full CRUD
- `student_read_own_attempts`: Students read own attempts
- `student_insert_own_attempt`: Students create own attempts
- `student_update_own_attempt`: Students update own attempts

---

### `attempt_answers`
Individual answers within an attempt.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK | |
| `attempt_id` | uuid | FK → `exam_attempts(id)` ON DELETE CASCADE, NOT NULL | Parent attempt |
| `question_id` | uuid | FK → `questions(id)`, NOT NULL | Answered question |
| `option_ids` | text[] | NOT NULL, default `'{}'` | Selected option IDs |
| `is_marked` | boolean | NOT NULL, default `false` | Marked for review |
| `is_correct` | boolean | nullable | Evaluated correctness |

**RLS Policies:**
- `admin_crud_attempt_answers`: Admin full CRUD
- `student_read_own_answers`: Students read own answers
- `student_insert_own_answers`: Students insert own answers
- `student_update_own_answers`: Students update own answers

---

### `activity_logs`
Audit trail of admin actions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK | |
| `actor_id` | uuid | FK → `users(id)`, NOT NULL | Admin who performed action |
| `message` | text | NOT NULL | Action description |
| `metadata` | jsonb | nullable | Additional data (e.g. tone) |
| `created_at` | timestamptz | NOT NULL, default `now()` | |

**RLS Policies:**
- `admin_crud_activity_logs`: Admin full CRUD only

---

### `announcements`
Platform-wide announcements visible to students.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK | |
| `title` | text | NOT NULL | Announcement headline |
| `body` | text | NOT NULL | Announcement body |
| `date` | date | NOT NULL, default `CURRENT_DATE` | Publication date |

**RLS Policies:**
- `admin_crud_announcements`: Admin full CRUD
- `student_read_announcements`: All authenticated users can read

---

## Views

### `student_detail`
Convenience view joining students + users + batches for common queries.

```sql
SELECT s.id AS student_id, u.id AS user_id, u.full_name, u.email, u.mobile,
       u.role, u.is_active, b.id AS batch_id, b.name AS batch_name,
       s.roll_number, s.joined_at, u.created_at
FROM students s
JOIN users u ON u.id = s.user_id
JOIN batches b ON b.id = s.batch_id;
```

### `assignment_detail`
Convenience view joining assignments + exams + batches with computed status.

```sql
SELECT ea.id AS assignment_id, ea.exam_id, e.name AS exam_name,
       ea.batch_id, b.name AS batch_name,
       (count students in batch) AS students_count,
       ea.opens_at, ea.closes_at, ea.created_at AS assigned_date,
       e.duration_minutes, e.total_marks, e.questions_count,
       CASE WHEN now() < opens_at THEN 'Scheduled'
            WHEN now() BETWEEN opens_at AND closes_at THEN 'Live'
            ELSE 'Closed' END AS status
FROM exam_assignments ea
JOIN exams e ON e.id = ea.exam_id
JOIN batches b ON b.id = ea.batch_id;
```

---

## Enums

| Enum | Values |
|------|--------|
| `role_enum` | `SUPER_ADMIN`, `ADMIN`, `STUDENT` |
| `batch_status` | `UPCOMING`, `ACTIVE`, `COMPLETED`, `ARCHIVED` |
| `exam_status` | `DRAFT`, `PUBLISHED`, `ACTIVE`, `CLOSED` |
| `question_type` | `MCQ`, `MSQ`, `TRUE_FALSE` |
| `attempt_status` | `NOT_STARTED`, `IN_PROGRESS`, `SUBMITTED`, `EVALUATED` |

---

## Helper Functions

### `is_admin()`
Returns `true` if the current authenticated user has SUPER_ADMIN or ADMIN role.

```sql
SELECT EXISTS (
  SELECT 1 FROM public.users
  WHERE auth_id = auth.uid()
  AND role IN ('SUPER_ADMIN', 'ADMIN')
);
```
Defined as `SECURITY DEFINER` so it runs with the function owner's privileges.

### `update_updated_at()`
Trigger function that sets `updated_at = now()` on every UPDATE.

---

## Triggers

| Table | Trigger | Function |
|-------|---------|----------|
| `users` | `trg_users_updated_at` (BEFORE UPDATE) | `update_updated_at()` |
| `batches` | `trg_batches_updated_at` (BEFORE UPDATE) | `update_updated_at()` |
| `exams` | `trg_exams_updated_at` (BEFORE UPDATE) | `update_updated_at()` |

---

## Auth Integration

The platform uses Supabase Auth for authentication. The `users` table links to `auth.users` via the `auth_id` column.

### Demo Accounts

| Email | Password | Role |
|-------|----------|------|
| `admin@tnpsce.academy` | `Password123` | SUPER_ADMIN |
| `student@tnpsce.academy` | `Password123` | STUDENT |

---

## Migrations Applied

1. **`create_full_schema`** — Creates all tables, enums, RLS policies, indexes, triggers, views, and helper functions.
2. **`seed_demo_data`** — Seeds demo data including auth users, 10 batches, ~481 students, 50 exams, 1000 questions, 14 assignments, 70 attempts, 4 activity logs, and 2 announcements.
