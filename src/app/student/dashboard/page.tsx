import Link from "next/link";
import { Megaphone, NotebookTabs, Sigma, Trophy } from "lucide-react";
import { StatsCard } from "@/components/stats-card";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { PageHeader } from "@/components/page-header";
import {
  announcements,
  currentStudent,
  currentStudentResults,
  studentAssignedExams
} from "@/lib/data";
import { formatDate } from "@/lib/utils";

export default function StudentDashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Dashboard"
        description={`Welcome back, ${currentStudent.fullName}. Track assigned exams, completed tests, and score movement.`}
      />
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatsCard label="Assigned Exams" value={studentAssignedExams.length} helper="2 ready now" icon={NotebookTabs} />
        <StatsCard label="Completed Exams" value={currentStudent.completedExams} helper="Across this batch" icon={Trophy} tone="success" />
        <StatsCard label="Average Score" value={`${currentStudent.averageScore}%`} helper="Batch average 68%" icon={Sigma} tone="secondary" />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Exams</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 lg:grid-cols-2">
            {studentAssignedExams.slice(0, 4).map((assignment) => (
              <div key={assignment.id} className="rounded-card border border-neutral-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-neutral-900">{assignment.examName}</p>
                    <p className="mt-1 text-sm text-neutral-500">{formatDate(assignment.opensAt)}</p>
                  </div>
                  <Badge>{assignment.progress}</Badge>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm font-semibold text-neutral-500">{assignment.exam.duration} min</span>
                  <Link href="/student/exams/instructions">
                    <Button size="sm">Start Exam</Button>
                  </Link>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Announcements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="flex gap-3 rounded-card bg-neutral-50 p-4">
                <Megaphone className="mt-1 h-5 w-5 text-primary" />
                <div>
                  <p className="font-bold text-neutral-900">{announcement.title}</p>
                  <p className="mt-1 text-sm leading-6 text-neutral-500">{announcement.body}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Recent Results</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {currentStudentResults.slice(0, 4).map((result) => (
            <div key={result.id} className="rounded-card bg-neutral-50 p-4">
              <p className="line-clamp-1 font-bold text-neutral-900">{result.examName}</p>
              <p className="mt-2 text-3xl font-black text-primary">{result.percentage}%</p>
              <Badge>{result.result}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
