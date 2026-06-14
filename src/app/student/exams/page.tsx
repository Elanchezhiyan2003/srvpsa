import Link from "next/link";
import { Clock, FileQuestionMark as FileQuestion, Medal, CirclePlay as PlayCircle } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Badge, Button, Card, CardContent } from "@/components/ui";
import { getCurrentStudent, getStudentAssignedExams } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export default async function AssignedExamsPage() {
  const student = await getCurrentStudent();

  if (!student) {
    return <div>Student not found</div>;
  }

  const assignedExams = await getStudentAssignedExams(student.batch_id);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Assigned Exams"
        description="Review exam details, duration, marks, assigned date, and start eligible tests."
        icon={FileQuestion}
      />
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {assignedExams.map((assignment) => (
          <Card key={assignment.assignment_id}>
            <CardContent className="space-y-5 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-black text-neutral-900">{assignment.exam_name}</p>
                  <p className="mt-1 text-sm text-neutral-500">{assignment.batch_name}</p>
                </div>
                <Badge>{(assignment as any).progress}</Badge>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Metric icon={Clock} label="Duration" value={`${assignment.duration_minutes}m`} />
                <Metric icon={FileQuestion} label="Questions" value={assignment.questions_count} />
                <Metric icon={Medal} label="Marks" value={assignment.total_marks} />
              </div>
              <div className="flex items-center justify-between gap-3 border-t border-neutral-100 pt-4">
                <span className="text-sm font-semibold text-neutral-500">
                  Assigned {formatDate(assignment.assigned_date)}
                </span>
                <Link href="/student/exams/instructions">
                  <Button size="sm">
                    <PlayCircle className="h-4 w-4" />
                    Start Exam
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value
}: {
  icon: typeof Clock;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-card bg-neutral-50 p-3">
      <Icon className="h-4 w-4 text-primary" />
      <p className="mt-2 text-xs font-bold text-neutral-500">{label}</p>
      <p className="text-sm font-black text-neutral-900">{value}</p>
    </div>
  );
}
