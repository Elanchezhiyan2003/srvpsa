"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  BookmarkCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Cloud,
  Maximize,
  Send,
  Wifi
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useExamStore } from "@/store/use-exam-store";
import { Badge, Button, Card, CardContent } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { Exam, Question, QuestionOption } from "@/lib/types";
import { questionTypeLabel } from "@/lib/auth";

interface ExamQuestion extends Question {
  options: QuestionOption[];
}

export function ExamInterface() {
  const [exam, setExam] = useState<Exam | null>(null);
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const {
    currentQuestion,
    setCurrentQuestion,
    answers,
    answerQuestion,
    markForReview,
    autoSavedAt
  } = useExamStore();
  const question = questions[currentQuestion];

  useEffect(() => {
    async function loadExam() {
      const supabase = createClient();
      const { data: examData } = await supabase
        .from("exams")
        .select("*")
        .eq("status", "ACTIVE")
        .limit(1)
        .maybeSingle();

      if (examData) {
        setExam(examData as unknown as Exam);
        setSecondsLeft(examData.duration_minutes * 60);

        const { data: questionData } = await supabase
          .from("questions")
          .select("*, options(*)")
          .eq("exam_id", examData.id)
          .order("sort_order")
          .limit(15);

        if (questionData) {
          setQuestions(
            questionData.map((q: Record<string, unknown>) => ({
              id: q.id as string,
              exam_id: q.exam_id as string,
              type: q.type as Question["type"],
              subject: q.subject as string,
              prompt: q.prompt as string,
              options: ((q.options as QuestionOption[]) ?? []).map((o) => ({
                id: o.id,
                label: o.label,
                value: o.value,
                is_correct: o.is_correct
              })),
              correctAnswer: ((q.options as QuestionOption[]) ?? []).filter((o) => o.is_correct).map((o) => o.id),
              marks: q.marks as number,
              explanation: q.explanation as string | null,
              sort_order: q.sort_order as number
            }))
          );
        }
      }
      setLoading(false);
    }
    loadExam();
  }, []);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = window.setInterval(() => {
      setSecondsLeft((value) => Math.max(value - 1, 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [secondsLeft]);

  const timeLabel = useMemo(() => {
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }, [secondsLeft]);

  const answeredCount = Object.values(answers).filter((answer) => answer.selected.length > 0).length;
  const reviewCount = Object.values(answers).filter((answer) => answer.markedForReview).length;

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-neutral-50">
        <p className="text-lg font-bold text-neutral-500">Loading exam...</p>
      </div>
    );
  }

  if (!exam || !question) {
    return (
      <div className="grid min-h-screen place-items-center bg-neutral-50">
        <p className="text-lg font-bold text-neutral-500">No active exam found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-neutral-500">Online Exam Interface</p>
            <h1 className="text-lg font-black text-neutral-900">{exam.name}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="danger">Timer {timeLabel}</Badge>
            <Badge tone="success">
              <Cloud className="mr-1 h-3.5 w-3.5" />
              Auto saved {autoSavedAt}
            </Badge>
            <Badge tone="primary">
              <Wifi className="mr-1 h-3.5 w-3.5" />
              Network stable
            </Badge>
            <Button variant="outline" size="sm">
              <Maximize className="h-4 w-4" />
              Fullscreen
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1500px] gap-5 px-4 py-5 xl:grid-cols-[1fr_340px]">
        <Card>
          <CardContent className="p-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-primary">Question {currentQuestion + 1}</p>
                <p className="mt-1 text-sm text-neutral-500">{question.subject} · {questionTypeLabel[question.type] ?? question.type} · {question.marks} marks</p>
              </div>
              <Badge>{questionTypeLabel[question.type] ?? question.type}</Badge>
            </div>
            <h2 className="text-xl font-bold leading-8 text-neutral-900">{question.prompt}</h2>
            <div className="mt-6 grid gap-3">
              {question.options.map((option) => {
                const selected = answers[question.id]?.selected.includes(option.id);
                return (
                  <button
                    key={option.id}
                    onClick={() => answerQuestion(question.id, option.id, question.type === "MSQ")}
                    className={cn(
                      "focus-ring flex items-center gap-3 rounded-card border border-neutral-200 bg-white p-4 text-left text-sm font-semibold text-neutral-700 transition hover:border-primary/40 hover:bg-blue-50",
                      selected && "border-primary bg-blue-50 text-primary"
                    )}
                  >
                    <span
                      className={cn(
                        "grid h-8 w-8 shrink-0 place-items-center rounded-full border border-neutral-300 text-xs font-black",
                        selected && "border-primary bg-primary text-white"
                      )}
                    >
                      {option.label}
                    </span>
                    {option.value}
                  </button>
                );
              })}
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100 pt-5">
              <Button
                variant="outline"
                disabled={currentQuestion === 0}
                onClick={() => setCurrentQuestion(Math.max(currentQuestion - 1, 0))}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => markForReview(question.id)}>
                  <BookmarkCheck className="h-4 w-4" />
                  Mark For Review
                </Button>
                <Button
                  onClick={() =>
                    setCurrentQuestion(Math.min(currentQuestion + 1, questions.length - 1))
                  }
                >
                  Save & Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Link href="/student/exams/submit">
                  <Button variant="success">
                    <Send className="h-4 w-4" />
                    Submit Exam
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <aside className="space-y-5">
          <Card>
            <CardContent className="p-5">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-card bg-emerald-50 p-3">
                  <p className="text-xl font-black text-success">{answeredCount}</p>
                  <p className="text-xs font-bold text-neutral-500">Answered</p>
                </div>
                <div className="rounded-card bg-neutral-100 p-3">
                  <p className="text-xl font-black text-neutral-700">
                    {questions.length - answeredCount}
                  </p>
                  <p className="text-xs font-bold text-neutral-500">Not Answered</p>
                </div>
                <div className="rounded-card bg-amber-50 p-3">
                  <p className="text-xl font-black text-warning">{reviewCount}</p>
                  <p className="text-xs font-bold text-neutral-500">Review</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="mb-4 font-bold text-neutral-900">Question Navigator</p>
              <div className="grid grid-cols-5 gap-2">
                {questions.map((item, index) => {
                  const answer = answers[item.id];
                  const tone = answer?.markedForReview
                    ? "bg-amber-100 text-amber-700"
                    : answer?.selected.length
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-neutral-100 text-neutral-600";
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentQuestion(index)}
                      className={cn(
                        "focus-ring grid h-10 place-items-center rounded-button text-sm font-black transition",
                        tone,
                        index === currentQuestion && "ring-2 ring-primary"
                      )}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
              <div className="mt-5 space-y-2 text-xs font-bold text-neutral-500">
                <Legend color="bg-emerald-100" label="Answered" />
                <Legend color="bg-neutral-100" label="Not Answered" />
                <Legend color="bg-amber-100" label="Mark For Review" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-5">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <p className="text-sm font-semibold leading-6 text-neutral-600">
                Submit protection is active. You will see a confirmation summary before final submission.
              </p>
            </CardContent>
          </Card>
        </aside>
      </main>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={cn("h-3 w-3 rounded-full", color)} />
      {label}
    </div>
  );
}
