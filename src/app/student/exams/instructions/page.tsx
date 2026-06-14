import Link from "next/link";
import { AlertTriangle, Clock, Medal, PlayCircle } from "lucide-react";
import { activeExam } from "@/lib/data";
import { PageHeader } from "@/components/page-header";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

export default function ExamInstructionsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Exam Instructions"
        description="Read the rules, confirm agreement, and start the online exam."
        icon={AlertTriangle}
      />
      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader>
            <CardTitle>{activeExam.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              "The countdown timer starts immediately after clicking Start Exam.",
              "Answers are auto-saved while the exam is in progress.",
              "Use Mark For Review for questions you want to revisit.",
              "Do not refresh, switch devices, or close the browser during the exam.",
              "Submission is final after confirmation."
            ].map((rule) => (
              <div key={rule} className="flex gap-3 rounded-card bg-neutral-50 p-4">
                <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                <p className="text-sm font-semibold leading-6 text-neutral-600">{rule}</p>
              </div>
            ))}
            <label className="flex items-start gap-3 rounded-card border border-neutral-200 p-4">
              <input type="checkbox" className="mt-1 h-5 w-5 accent-primary" defaultChecked />
              <span className="text-sm font-bold text-neutral-700">I Agree to Follow Exam Rules</span>
            </label>
            <Link href="/student/exams/take">
              <Button size="lg">
                <PlayCircle className="h-5 w-5" />
                Start Exam
              </Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Exam Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Summary icon={Clock} label="Duration" value={`${activeExam.duration} minutes`} />
            <Summary icon={Medal} label="Marks" value={`${activeExam.totalMarks} total`} />
            <Summary icon={AlertTriangle} label="Negative Marks" value={`${activeExam.negativeMarks} per wrong answer`} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Summary({
  icon: Icon,
  label,
  value
}: {
  icon: typeof Clock;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-card bg-neutral-50 p-4">
      <Icon className="h-5 w-5 text-primary" />
      <div>
        <p className="text-xs font-bold uppercase text-neutral-400">{label}</p>
        <p className="font-bold text-neutral-900">{value}</p>
      </div>
    </div>
  );
}
