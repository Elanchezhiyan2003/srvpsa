import {
  Activity,
  BookOpenCheck,
  CalendarClock,
  Layers3,
  Trophy,
  Users
} from "lucide-react";
import {
  BatchPerformanceChart,
  ChartPanel,
  ParticipationTrend,
  PassFailChart
} from "@/components/charts";
import { StatsCard } from "@/components/stats-card";
import { Badge, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { PageHeader } from "@/components/page-header";
import {
  activities,
  adminMetrics,
  batchPerformance,
  passFailAnalysis,
  participationTrend,
  topPerformingStudents,
  upcomingExams
} from "@/lib/data";
import { formatDate, formatTime } from "@/lib/utils";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Monitor students, batches, exams, participation, and performance from one operating view."
        icon={Activity}
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard label="Total Students" value={adminMetrics.totalStudents} helper="+28 this week" icon={Users} />
        <StatsCard label="Total Batches" value={adminMetrics.totalBatches} helper="7 active batches" icon={Layers3} tone="secondary" />
        <StatsCard label="Total Exams" value={adminMetrics.totalExams} helper="12 published" icon={BookOpenCheck} tone="success" />
        <StatsCard label="Active Exams" value={adminMetrics.activeExams} helper="Live now" icon={CalendarClock} tone="warning" />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
        <ChartPanel title="Exam Participation Trend">
          <ParticipationTrend data={participationTrend} />
        </ChartPanel>
        <ChartPanel title="Pass vs Fail Analysis">
          <PassFailChart data={passFailAnalysis} />
        </ChartPanel>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <ChartPanel title="Batch Performance">
          <BatchPerformanceChart data={batchPerformance} />
        </ChartPanel>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activities.map((item) => (
              <div key={item.id} className="flex gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
                <div>
                  <p className="text-sm font-bold text-neutral-900">{item.actor}</p>
                  <p className="text-sm leading-5 text-neutral-500">{item.message}</p>
                  <p className="mt-1 text-xs font-semibold text-neutral-400">{item.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Exams</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingExams.map((assignment) => (
              <div key={assignment.id} className="flex flex-wrap items-center justify-between gap-3 rounded-card bg-neutral-50 p-4">
                <div>
                  <p className="font-bold text-neutral-900">{assignment.examName}</p>
                  <p className="mt-1 text-sm text-neutral-500">
                    {assignment.batchName} · {formatDate(assignment.opensAt)} {formatTime(assignment.opensAt)}
                  </p>
                </div>
                <Badge>{assignment.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Students</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topPerformingStudents.map((student, index) => (
              <div key={student.id} className="flex items-center gap-3 rounded-card bg-neutral-50 p-4">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-amber-100 text-sm font-black text-warning">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-neutral-900">{student.fullName}</p>
                  <p className="text-sm text-neutral-500">{student.batchName}</p>
                </div>
                <div className="flex items-center gap-1 text-sm font-black text-success">
                  <Trophy className="h-4 w-4" />
                  {student.averageScore}%
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
