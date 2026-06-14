import Link from "next/link";
import { ArrowRight, BookOpenCheck, GraduationCap, ShieldCheck } from "lucide-react";
import { Button, Card, CardContent } from "@/components/ui";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-neutral-50">
      <section className="mx-auto grid min-h-screen w-full max-w-7xl items-center gap-8 px-4 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-6">
        <div>
          <div className="mb-6 flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-button bg-primary text-white">
              <GraduationCap className="h-7 w-7" />
            </span>
            <div>
              <p className="text-lg font-black text-neutral-900">TNPSCE Academy</p>
              <p className="text-sm font-semibold text-neutral-500">Examination Platform</p>
            </div>
          </div>
          <h1 className="max-w-3xl text-4xl font-black leading-tight text-neutral-950 sm:text-5xl lg:text-6xl">
            TNPSCE Academy Examination Platform
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-neutral-600">
            Batch-based online exams with admin controls for students, question building, assignments,
            monitoring, and analytics, plus a focused student exam-taking portal.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/admin/login">
              <Button size="lg">
                <ShieldCheck className="h-5 w-5" />
                Admin Portal
              </Button>
            </Link>
            <Link href="/student/login">
              <Button size="lg" variant="outline">
                <BookOpenCheck className="h-5 w-5" />
                Student Portal
              </Button>
            </Link>
          </div>
        </div>
        <div className="grid gap-4">
          {[
            ["Create batches", "Organize learners by exam track, date range, and status."],
            ["Build exams", "Create MCQ, MSQ, and True/False assessments with marks and negative scoring."],
            ["Analyze outcomes", "Track pass rate, ranks, score distribution, and batch comparison."]
          ].map(([title, body]) => (
            <Card key={title}>
              <CardContent className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-neutral-900">{title}</p>
                  <p className="mt-1 text-sm leading-6 text-neutral-500">{body}</p>
                </div>
                <ArrowRight className="h-5 w-5 text-primary" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
