import type {
  Activity,
  Announcement,
  Assignment,
  Batch,
  Exam,
  Question,
  ResultRow,
  Student
} from "@/lib/types";

const firstNames = [
  "Aadhira",
  "Arun",
  "Divya",
  "Harish",
  "Janani",
  "Karthik",
  "Lavanya",
  "Madhan",
  "Nithya",
  "Pranav",
  "Rohini",
  "Saravanan",
  "Tharun",
  "Vaishnavi",
  "Yamini",
  "Gokul",
  "Priya",
  "Sanjay",
  "Meena",
  "Vignesh"
];

const lastNames = [
  "Raman",
  "Subramanian",
  "Kumar",
  "Iyer",
  "Krishnan",
  "Rajendran",
  "Murugan",
  "Selvi",
  "Natarajan",
  "Balaji"
];

const subjects = [
  "Tamil Nadu History",
  "Indian Polity",
  "General Science",
  "Aptitude",
  "Current Affairs",
  "Geography",
  "Economics",
  "Environment"
];

export const batches: Batch[] = Array.from({ length: 10 }, (_, index) => {
  const year = 2026;
  const month = index % 10;
  const studentsCount = 42 + ((index * 11) % 34);

  return {
    id: `batch-${index + 1}`,
    name: `TNPSC Group ${index % 2 === 0 ? "II" : "IV"} ${String.fromCharCode(65 + index)}`,
    description: `${subjects[index % subjects.length]} focused preparation batch with weekly mock examinations.`,
    startDate: new Date(year, month, 1).toISOString(),
    endDate: new Date(year, month + 4, 28).toISOString(),
    status: index < 7 ? "Active" : index < 9 ? "Upcoming" : "Completed",
    studentsCount,
    averageScore: 62 + ((index * 7) % 25)
  };
});

export const students: Student[] = Array.from({ length: 500 }, (_, index) => {
  const batch = batches[index % batches.length];
  const firstName = firstNames[index % firstNames.length];
  const lastName = lastNames[(index * 3) % lastNames.length];
  const padded = String(index + 1).padStart(4, "0");
  const averageScore = 48 + ((index * 17) % 48);

  return {
    id: `student-${index + 1}`,
    fullName: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${index + 1}@tnpsce.academy`,
    mobile: `9${String(600000000 + index * 7919).slice(0, 9)}`,
    batchId: batch.id,
    batchName: batch.name,
    rollNumber: `TNPSCE${padded}`,
    joinedAt: new Date(2026, index % 9, (index % 26) + 1).toISOString(),
    averageScore,
    completedExams: 3 + (index % 18),
    status: index % 29 === 0 ? "Inactive" : "Active"
  };
});

export const exams: Exam[] = Array.from({ length: 50 }, (_, index) => {
  const statusCycle: Exam["status"][] = ["Published", "Active", "Draft", "Closed"];
  const questions = 20 + (index % 4) * 5;
  const totalMarks = questions * 2;

  return {
    id: `exam-${index + 1}`,
    name: `${subjects[index % subjects.length]} Mock Test ${index + 1}`,
    description: `Timed objective examination covering ${subjects[index % subjects.length].toLowerCase()} for TNPSC aspirants.`,
    subject: subjects[index % subjects.length],
    questions,
    duration: 45 + (index % 5) * 15,
    totalMarks,
    passingMarks: Math.round(totalMarks * 0.45),
    negativeMarks: index % 3 === 0 ? 0.25 : 0,
    status: statusCycle[index % statusCycle.length],
    createdAt: new Date(2026, index % 11, (index % 26) + 1).toISOString(),
    assignedBatches: 1 + (index % 5)
  };
});

export const questions: Question[] = exams.flatMap((exam, examIndex) =>
  Array.from({ length: 20 }, (_, qIndex) => {
    const globalIndex = examIndex * 20 + qIndex;
    const type = globalIndex % 9 === 0 ? "MSQ" : globalIndex % 7 === 0 ? "True/False" : "MCQ";
    const options =
      type === "True/False"
        ? [
            { id: `q-${globalIndex}-a`, label: "A", value: "True", isCorrect: globalIndex % 2 === 0 },
            { id: `q-${globalIndex}-b`, label: "B", value: "False", isCorrect: globalIndex % 2 !== 0 }
          ]
        : ["A", "B", "C", "D"].map((label, optionIndex) => ({
            id: `q-${globalIndex}-${label.toLowerCase()}`,
            label,
            value: [
              "Constitutional development and governance",
              "Socio-economic reform movement",
              "Administrative ethics and accountability",
              "Public service delivery model"
            ][(globalIndex + optionIndex) % 4],
            isCorrect: type === "MSQ" ? optionIndex < 2 : optionIndex === globalIndex % 4
          }));

    return {
      id: `question-${globalIndex + 1}`,
      examId: exam.id,
      type,
      subject: exam.subject,
      prompt: `Which statement is most accurate for ${exam.subject} topic ${qIndex + 1}?`,
      options,
      correctAnswer: options.filter((option) => option.isCorrect).map((option) => option.id),
      marks: 2,
      explanation: "The answer follows the standard TNPSC syllabus interpretation and recent exam pattern."
    };
  })
);

export const assignments: Assignment[] = Array.from({ length: 14 }, (_, index) => {
  const exam = exams[index];
  const batch = batches[index % batches.length];

  return {
    id: `assignment-${index + 1}`,
    examId: exam.id,
    examName: exam.name,
    batchId: batch.id,
    batchName: batch.name,
    studentsCount: batch.studentsCount,
    assignedDate: new Date(2026, 5, index + 1).toISOString(),
    opensAt: new Date(2026, 5, index + 2, 9).toISOString(),
    closesAt: new Date(2026, 5, index + 3, 21).toISOString(),
    status: index < 4 ? "Live" : index < 10 ? "Scheduled" : "Closed"
  };
});

export const results: ResultRow[] = students.slice(0, 240).map((student, index) => {
  const exam = exams[index % exams.length];
  const score = Math.min(exam.totalMarks, Math.max(14, 28 + ((index * 13) % exam.totalMarks)));
  const percentage = Math.round((score / exam.totalMarks) * 100);

  return {
    id: `result-${index + 1}`,
    studentId: student.id,
    studentName: student.fullName,
    batchName: student.batchName,
    examName: exam.name,
    score,
    percentage,
    rank: index + 1,
    result: percentage >= 45 ? "Passed" : "Failed",
    correct: Math.round(percentage / 5),
    wrong: 4 + (index % 8),
    skipped: index % 5
  };
});

export const activities: Activity[] = [
  {
    id: "activity-1",
    actor: "Admin Priya",
    message: "Published Indian Polity Mock Test 18",
    time: "10 minutes ago",
    tone: "success"
  },
  {
    id: "activity-2",
    actor: "System",
    message: "CSV upload validated 86 student records",
    time: "34 minutes ago",
    tone: "neutral"
  },
  {
    id: "activity-3",
    actor: "Admin Karthik",
    message: "Assigned Aptitude Mock Test 12 to Group IV D",
    time: "1 hour ago",
    tone: "warning"
  },
  {
    id: "activity-4",
    actor: "Exam Monitor",
    message: "Network warning detected for 3 active attempts",
    time: "2 hours ago",
    tone: "danger"
  }
];

export const announcements: Announcement[] = [
  {
    id: "announcement-1",
    title: "June weekly mock schedule published",
    body: "Group II and Group IV batches have new weekend practice tests.",
    date: "2026-06-12"
  },
  {
    id: "announcement-2",
    title: "Current affairs revision window",
    body: "Students can review May and June current affairs modules before the next exam.",
    date: "2026-06-10"
  }
];

export const participationTrend = [
  { month: "Jan", appeared: 318, assigned: 360 },
  { month: "Feb", appeared: 342, assigned: 380 },
  { month: "Mar", appeared: 389, assigned: 420 },
  { month: "Apr", appeared: 421, assigned: 455 },
  { month: "May", appeared: 448, assigned: 480 },
  { month: "Jun", appeared: 472, assigned: 500 }
];

export const passFailAnalysis = [
  { name: "Passed", value: 78 },
  { name: "Failed", value: 22 }
];

export const batchPerformance = batches.map((batch) => ({
  name: batch.name.replace("TNPSC ", ""),
  average: batch.averageScore,
  students: batch.studentsCount
}));

export const performanceDistribution = [
  { range: "0-40", students: 18 },
  { range: "41-50", students: 42 },
  { range: "51-60", students: 56 },
  { range: "61-70", students: 74 },
  { range: "71-80", students: 62 },
  { range: "81-90", students: 31 },
  { range: "91-100", students: 9 }
];

export const subjectPerformance = subjects.slice(0, 6).map((subject, index) => ({
  subject,
  score: 58 + ((index * 9) % 34),
  average: 54 + ((index * 7) % 28)
}));

export const adminMetrics = {
  totalStudents: students.length,
  totalBatches: batches.length,
  totalExams: exams.length,
  activeExams: exams.filter((exam) => exam.status === "Active").length,
  averageScore: Math.round(results.reduce((sum, row) => sum + row.percentage, 0) / results.length),
  passRate: Math.round((results.filter((row) => row.result === "Passed").length / results.length) * 100),
  highestScore: Math.max(...results.map((row) => row.percentage)),
  lowestScore: Math.min(...results.map((row) => row.percentage))
};

export const topPerformingStudents = [...students]
  .sort((a, b) => b.averageScore - a.averageScore)
  .slice(0, 6);

export const upcomingExams = assignments.filter((assignment) => assignment.status !== "Closed").slice(0, 5);

export const currentStudent = students[18];

export const currentStudentResults = results
  .filter((result) => result.studentId === currentStudent.id || result.batchName === currentStudent.batchName)
  .slice(0, 8);

export const studentAssignedExams = assignments.slice(0, 6).map((assignment, index) => ({
  ...assignment,
  exam: exams[index],
  progress: index % 3 === 0 ? "Ready" : index % 3 === 1 ? "Upcoming" : "Attempted"
}));

export const activeExam = exams[1];
export const activeExamQuestions = questions.filter((question) => question.examId === activeExam.id).slice(0, 15);
