import Link from "next/link";
import { CircleAlert as AlertCircle, CircleCheck as CheckCircle2, RotateCcw, Send } from "lucide-react";
import { getActiveExam, getActiveExamQuestions } from "@/lib/data";
import { PageHeader } from "@/components/page-header";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

export default async function SubmitConfirmationPage() {
  const exam = await getActiveExam();
  const questions = exam ? await getActiveExamQuestions(exam.id) : [];

  const answered = 11;
  const review = 3;
  const unanswered = questions.length - answered;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Submit Confirmation"
        description="Review answered, unanswered, and marked questions before final submission."
        icon={AlertCircle}
      />
      <Card>
        <CardHeader>
          <CardTitle>Submission Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Summary label="Answered Questions" value={answered} tone="success" />
            <Summary label="Unanswered Questions" value={unanswered} tone="danger" />
            <Summary label="Review Questions" value={review} tone="warning" />
          </div>
          <div className="mt-6 rounded-card border border-amber-200 bg-amber-50 p-4">
            <p className="font-bold text-amber-800">Submit protection</p>
            <p className="mt-1 text-sm leading-6 text-amber-700">
              Once confirmed, the exam attempt is locked and moved to evaluation.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap justify-end gap-2">
            <Link href="/student/exams/take">
              <Button variant="outline">
                <RotateCcw className="h-4 w-4" />
                Continue Exam
              </Button>
            </Link>
            <Link href="/student/results">
              <Button variant="success">
                <Send className="h-4 w-4" />
                Confirm Submit
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Summary({
  label,
  value,
  tone
}: {
  label: string;
  value: number;
  tone: "success" | "warning" | "danger";
}) {
  const tones = {
    success: "bg-emerald-50 text-success",
    warning: "bg-amber-50 text-warning",
    danger: "bg-red-50 text-danger"
  };
  return (
    <div className={`rounded-card p-5 ${tones[tone]}`}>
      <CheckCircle2 className="h-5 w-5" />
      <p className="mt-3 text-4xl font-black">{value}</p>
      <p className="mt-1 text-sm font-bold">{label}</p>
    </div>
  );
}
