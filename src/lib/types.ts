export type Role = "SUPER_ADMIN" | "ADMIN" | "STUDENT";

export type BatchStatus = "Upcoming" | "Active" | "Completed" | "Archived";

export type ExamStatus = "Draft" | "Published" | "Active" | "Closed";

export type QuestionType = "MCQ" | "MSQ" | "True/False";

export type ResultStatus = "Passed" | "Failed";

export interface Batch {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: BatchStatus;
  studentsCount: number;
  averageScore: number;
}

export interface Student {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  batchId: string;
  batchName: string;
  rollNumber: string;
  joinedAt: string;
  averageScore: number;
  completedExams: number;
  status: "Active" | "Inactive";
}

export interface Exam {
  id: string;
  name: string;
  description: string;
  subject: string;
  questions: number;
  duration: number;
  totalMarks: number;
  passingMarks: number;
  negativeMarks: number;
  status: ExamStatus;
  createdAt: string;
  assignedBatches: number;
}

export interface QuestionOption {
  id: string;
  label: string;
  value: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  examId: string;
  type: QuestionType;
  subject: string;
  prompt: string;
  options: QuestionOption[];
  correctAnswer: string[];
  marks: number;
  explanation: string;
}

export interface Assignment {
  id: string;
  examId: string;
  examName: string;
  batchId: string;
  batchName: string;
  studentsCount: number;
  assignedDate: string;
  opensAt: string;
  closesAt: string;
  status: "Scheduled" | "Live" | "Closed";
}

export interface ResultRow {
  id: string;
  studentId: string;
  studentName: string;
  batchName: string;
  examName: string;
  score: number;
  percentage: number;
  rank: number;
  result: ResultStatus;
  correct: number;
  wrong: number;
  skipped: number;
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
