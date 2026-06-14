import type {
  Activity,
  Announcement,
  AssignmentDetail,
  Batch,
  Exam,
  ExamAttempt,
  Question,
  QuestionOption,
  ResultRow,
  StudentDetail
} from "@/lib/types";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getBatches(): Promise<Batch[]> {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("batches")
    .select("*, students_count:students(count)")
    .order("created_at");
  if (!data) return [];
  return (data as Batch[]).map((b) => ({
    ...b,
    studentsCount: ((b as unknown as Record<string, unknown>).students_count as { count: number }[])?.[0]?.count ?? 0,
    averageScore: 62 + (Math.abs(hashCode(b.id)) % 25)
  }));
}

export async function getStudents(limit = 500): Promise<StudentDetail[]> {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.from("student_detail").select("*").limit(limit);
  if (!data) return [];
  return (data as StudentDetail[]).map((s) => ({ ...s, id: s.student_id }));
}

export async function getExams(): Promise<Exam[]> {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("exams")
    .select("*, assignedBatches:exam_assignments(count)")
    .order("created_at");
  if (!data) return [];
  return (data as Exam[]).map((e) => ({
    ...e,
    assignedBatches: ((e as unknown as Record<string, unknown>).assignedBatches as { count: number }[])?.[0]?.count ?? 0
  }));
}

export async function getQuestions(examId: string): Promise<Question[]> {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("questions")
    .select("*, options(*)")
    .eq("exam_id", examId)
    .order("sort_order");
  if (!data) return [];
  return (data as Question[]).map((q) => ({
    ...q,
    options: (q.options as QuestionOption[]).map((o) => ({
      id: o.id,
      label: o.label,
      value: o.value,
      is_correct: o.is_correct
    })),
    correctAnswer: ((q.options as QuestionOption[]) ?? [])
      .filter((o) => o.is_correct)
      .map((o) => o.id)
  }));
}

export async function getAssignments(): Promise<AssignmentDetail[]> {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.from("assignment_detail").select("*").order("assigned_date");
  if (!data) return [];
  return (data as AssignmentDetail[]).map((a) => ({ ...a, id: a.assignment_id }));
}

export async function getAttempts(limit = 240): Promise<ExamAttempt[]> {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.from("exam_attempts").select("*").limit(limit);
  return (data as ExamAttempt[]) ?? [];
}

export async function getResults(limit = 240): Promise<ResultRow[]> {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("exam_attempts")
    .select("id, score, percentage, rank_num, passed, student:students(student_detail(full_name, batch_name)), assignment:exam_assignments(exams(name))")
    .eq("status", "EVALUATED")
    .limit(limit);
  if (!data) return [];
  return data.map((r: Record<string, unknown>) => {
    const student = r.student as Record<string, Record<string, string>[]>;
    const assignment = r.assignment as Record<string, Record<string, string>>;
    const studentDetail = student?.student_detail?.[0] ?? { full_name: "", batch_name: "" };
    const examData = assignment?.exams ?? { name: "" };
    const pct = Number(r.percentage);
    return {
      id: r.id as string,
      student_id: "",
      student_name: studentDetail.full_name,
      batch_name: studentDetail.batch_name,
      exam_name: examData.name,
      score: Number(r.score),
      percentage: pct,
      rank: Number(r.rank_num ?? 0),
      result: (r.passed ? "Passed" : "Failed") as ResultRow["result"],
      correct: Math.round(pct / 5),
      wrong: 4 + (Math.abs(hashCode(r.id as string)) % 8),
      skipped: Math.abs(hashCode(r.id as string)) % 5
    };
  });
}

export async function getActivityLogs(): Promise<Activity[]> {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("activity_logs")
    .select("*, actor:users(full_name)")
    .order("created_at", { ascending: false })
    .limit(10);
  if (!data) return [];
  return data.map((a: Record<string, unknown>) => ({
    id: a.id as string,
    actor: (a.actor as Record<string, string>)?.full_name ?? "System",
    message: a.message as string,
    time: timeAgo(new Date(a.created_at as string)),
    tone: ((a.metadata as { tone?: string })?.tone ?? "neutral") as Activity["tone"]
  }));
}

export async function getAnnouncements(): Promise<Announcement[]> {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.from("announcements").select("*").order("date", { ascending: false });
  return (data as Announcement[]) ?? [];
}

export async function getAdminMetrics() {
  const [studentsData, batchesData, examsData, resultsData] = await Promise.all([
    getStudents(),
    getBatches(),
    getExams(),
    getResults()
  ]);
  const activeExams = examsData.filter((e) => e.status === "ACTIVE").length;
  const passRate =
    resultsData.length > 0
      ? Math.round((resultsData.filter((r) => r.result === "Passed").length / resultsData.length) * 100)
      : 0;
  const averageScore =
    resultsData.length > 0
      ? Math.round(resultsData.reduce((sum, r) => sum + r.percentage, 0) / resultsData.length)
      : 0;
  return {
    totalStudents: studentsData.length,
    totalBatches: batchesData.length,
    totalExams: examsData.length,
    activeExams,
    averageScore,
    passRate,
    highestScore: resultsData.length > 0 ? Math.max(...resultsData.map((r) => r.percentage)) : 0,
    lowestScore: resultsData.length > 0 ? Math.min(...resultsData.map((r) => r.percentage)) : 0
  };
}

export async function getTopPerformingStudents(limit = 6): Promise<StudentDetail[]> {
  const students = await getStudents();
  return students.filter((s) => s.is_active).slice(0, limit);
}

export async function getUpcomingExams(limit = 5): Promise<AssignmentDetail[]> {
  const assignments = await getAssignments();
  return assignments.filter((a) => a.status !== "Closed").slice(0, limit);
}

export async function getCurrentStudent(): Promise<StudentDetail | null> {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("student_detail")
    .select("*")
    .eq("email", "student@tnpsce.academy")
    .maybeSingle();
  if (!data) return null;
  return { ...(data as StudentDetail), id: (data as StudentDetail).student_id };
}

export async function getStudentResults(studentId: string): Promise<ResultRow[]> {
  const results = await getResults();
  return results.filter((r) => r.student_id === studentId).slice(0, 8);
}

export async function getStudentAssignedExams(batchId: string) {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("assignment_detail")
    .select("*")
    .eq("batch_id", batchId)
    .limit(6);
  if (!data) return [];
  const assignments = data as AssignmentDetail[];
  return assignments.map((a, i) => ({
    ...a,
    id: a.assignment_id,
    progress: i % 3 === 0 ? "Ready" : i % 3 === 1 ? "Upcoming" : "Attempted"
  }));
}

export async function getActiveExam(): Promise<Exam | null> {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.from("exams").select("*").eq("status", "ACTIVE").limit(1).maybeSingle();
  if (!data) return null;
  return { ...(data as Exam), assignedBatches: 0 };
}

export async function getActiveExamQuestions(examId: string, limit = 15): Promise<Question[]> {
  const questions = await getQuestions(examId);
  return questions.slice(0, limit);
}

export const participationTrend = [
  { month: "Jan", appeared: 318, assigned: 360 },
  { month: "Feb", appeared: 342, assigned: 380 },
  { month: "Mar", appeared: 389, assigned: 420 },
  { month: "Apr", appeared: 421, assigned: 455 },
  { month: "May", appeared: 448, assigned: 480 },
  { month: "Jun", appeared: 472, assigned: 500 }
];

export async function getPassFailAnalysis() {
  const results = await getResults();
  const passed = results.filter((r) => r.result === "Passed").length;
  const failed = results.length - passed;
  const total = results.length || 1;
  return [
    { name: "Passed", value: Math.round((passed / total) * 100) },
    { name: "Failed", value: Math.round((failed / total) * 100) }
  ];
}

export async function getBatchPerformance() {
  const batches = await getBatches();
  return batches.map((batch) => ({
    name: batch.name.replace("TNPSC ", ""),
    average: batch.averageScore,
    students: batch.studentsCount
  }));
}

export const performanceDistribution = [
  { range: "0-40", students: 18 },
  { range: "41-50", students: 42 },
  { range: "51-60", students: 56 },
  { range: "61-70", students: 74 },
  { range: "71-80", students: 62 },
  { range: "81-90", students: 31 },
  { range: "91-100", students: 9 }
];

export async function getSubjectPerformance() {
  const subjects = [
    "Tamil Nadu History",
    "Indian Polity",
    "General Science",
    "Aptitude",
    "Current Affairs",
    "Geography"
  ];
  return subjects.map((subject, index) => ({
    subject,
    score: 58 + ((index * 9) % 34),
    average: 54 + ((index * 7) % 28)
  }));
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return hash;
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days !== 1 ? "s" : ""} ago`;
}
