import { Award, CircleCheck as CheckCircle2, ChartBar as FileBarChart, Circle as XCircle } from "lucide-react";
import { ChartPanel, SubjectPerformanceChart } from "@/components/charts";
import { DataTable } from "@/components/data-table";
import { PageHeader } from "@/components/page-header";
import { StatsCard } from "@/components/stats-card";
import { Badge, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { getCurrentStudent, getStudentResults, getSubjectPerformance } from "@/lib/data";

export default async function StudentResultPage() {
  const student = await getCurrentStudent();

  if (!student) {
    return <div>Student not found</div>;
  }

  const [studentResults, subjectPerformance] = await Promise.all([
    getStudentResults(student.student_id),
    getSubjectPerformance()
  ]);

  const latest = studentResults[0] ?? {
    score: 62,
    percentage: 76,
    result: "Passed",
    rank: 8,
    correct: 28,
    wrong: 8,
    skipped: 4
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Result Page"
        description="Review score, percentage, pass status, rank, answer statistics, and subject-wise performance."
        icon={FileBarChart}
      />
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard label="Total Score" value={latest.score} helper="Out of assigned marks" icon={Award} />
        <StatsCard label="Percentage" value={`${latest.percentage}%`} helper="Batch average 68%" icon={FileBarChart} tone="secondary" />
        <StatsCard label="Rank" value={`#${latest.rank}`} helper="Within your batch" icon={Award} tone="success" />
        <Card className="p-5">
          <p className="text-sm font-semibold text-neutral-500">Result</p>
          <div className="mt-3">
            <Badge>{latest.result}</Badge>
          </div>
          <p className="mt-4 text-sm text-neutral-500">Passing mark achieved</p>
        </Card>
      </section>
      <section className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Stat icon={CheckCircle2} label="Correct Answers" value={latest.correct} tone="text-success" />
            <Stat icon={XCircle} label="Wrong Answers" value={latest.wrong} tone="text-danger" />
            <Stat icon={FileBarChart} label="Skipped Questions" value={latest.skipped} tone="text-warning" />
          </CardContent>
        </Card>
        <ChartPanel title="Subject-wise Performance">
          <SubjectPerformanceChart data={subjectPerformance} />
        </ChartPanel>
      </section>
      <DataTable
        rows={studentResults}
        columns={[
          { key: "exam_name", header: "Exam" },
          { key: "score", header: "Score" },
          { key: "percentage", header: "Percentage", render: (row) => `${row.percentage}%` },
          { key: "rank", header: "Rank", render: (row) => `#${row.rank}` },
          { key: "result", header: "Result", render: (row) => <Badge>{row.result}</Badge> }
        ]}
      />
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  tone
}: {
  icon: typeof CheckCircle2;
  label: string;
  value: number;
  tone: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-card bg-neutral-50 p-4">
      <Icon className={`h-5 w-5 ${tone}`} />
      <div>
        <p className="text-sm font-bold text-neutral-500">{label}</p>
        <p className="text-xl font-black text-neutral-900">{value}</p>
      </div>
    </div>
  );
}
