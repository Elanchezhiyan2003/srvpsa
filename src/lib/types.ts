export type Role = "SUPER_ADMIN" | "ADMIN" | "STUDENT";

export type BatchStatus = "UPCOMING" | "ACTIVE" | "COMPLETED" | "ARCHIVED";
export type BatchStatusLabel = "Upcoming" | "Active" | "Completed" | "Archived";

export type ExamStatus = "DRAFT" | "PUBLISHED" | "ACTIVE" | "CLOSED";
export type ExamStatusLabel = "Draft" | "Published" | "Active" | "Closed";

export type QuestionType = "MCQ" | "MSQ" | "TRUE_FALSE";
export type QuestionTypeLabel = "MCQ" | "MSQ" | "True/False";

export type AttemptStatus = "NOT_STARTED" | "IN_PROGRESS" | "SUBMITTED" | "EVALUATED";
export type ResultStatus = "Passed" | "Failed";

export type AssignmentStatus = "Scheduled" | "Live" | "Closed";

export interface Batch {
  id: string;
  name: string;
  description: string | null;
  start_date: string;
  end_date: string;
  status: BatchStatus;
  studentsCount: number;
  averageScore: number;
  created_at: string;
}

export interface StudentDetail {
  id: string;
  student_id: string;
  user_id: string;
  full_name: string;
  email: string;
  mobile: string | null;
  role: Role;
  is_active: boolean;
  batch_id: string;
  batch_name: string;
  roll_number: string;
  joined_at: string;
  created_at: string;
}

export interface Exam {
  id: string;
  name: string;
  description: string | null;
  subject: string;
  questions_count: number;
  duration_minutes: number;
  total_marks: number;
  passing_marks: number;
  negative_marks: number;
  status: ExamStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  assignedBatches: number;
}

export interface QuestionOption {
  id: string;
  label: string;
  value: string;
  is_correct: boolean;
}

export interface Question {
  id: string;
  exam_id: string;
  type: QuestionType;
  subject: string;
  prompt: string;
  options: QuestionOption[];
  correctAnswer: string[];
  marks: number;
  explanation: string | null;
  sort_order: number;
}

export interface AssignmentDetail {
  id: string;
  assignment_id: string;
  exam_id: string;
  exam_name: string;
  batch_id: string;
  batch_name: string;
  students_count: number;
  opens_at: string;
  closes_at: string;
  assigned_date: string;
  duration_minutes: number;
  total_marks: number;
  questions_count: number;
  status: AssignmentStatus;
}

export interface ExamAttempt {
  id: string;
  assignment_id: string;
  student_id: string;
  status: AttemptStatus;
  started_at: string | null;
  submitted_at: string | null;
  score: number;
  percentage: number;
  rank_num: number | null;
  passed: boolean;
}

export interface ResultRow {
  id: string;
  student_id: string;
  student_name: string;
  batch_name: string;
  exam_name: string;
  score: number;
  percentage: number;
  rank: number;
  result: ResultStatus;
  correct: number;
  wrong: number;
  skipped: number;
}

export interface ActivityLog {
  id: string;
  actor_id: string;
  message: string;
  metadata: { tone?: string } | null;
  created_at: string;
}

export interface Activity {
  id: string;
  actor: string;
  message: string;
  time: string;
  tone: "success" | "warning" | "danger" | "neutral";
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  date: string;
}

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}
