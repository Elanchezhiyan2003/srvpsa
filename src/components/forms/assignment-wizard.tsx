"use client";

import { useEffect, useMemo, useState } from "react";
import { CircleCheck as CheckCircle2, Send } from "lucide-react";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Modal, Select } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";
import type { Batch, Exam } from "@/lib/types";

export function AssignmentWizard() {
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);

  useEffect(() => {
    async function loadData() {
      const supabase = createClient();
      const [batchRes, examRes] = await Promise.all([
        supabase.from("batches").select("*").order("created_at"),
        supabase.from("exams").select("*").order("created_at").limit(10)
      ]);
      if (batchRes.data) setBatches(batchRes.data as Batch[]);
      if (examRes.data) setExams(examRes.data as Exam[]);
    }
    loadData();
  }, []);

  const selectedExam = exams[1] ?? null;
  const selectedBatch = batches[2] ?? null;
  const examOptions = useMemo(
    () => exams.map((exam) => ({ label: exam.name, value: exam.id })),
    [exams]
  );
  const batchOptions = useMemo(
    () => batches.map((batch) => ({ label: batch.name, value: batch.id })),
    [batches]
  );

  return (
    <div className="space-y-5">
      <div className="grid gap-3 md:grid-cols-3">
        {["Select Exam", "Select Batch", "Review Assignment"].map((label, index) => (
          <button
            key={label}
            className={`rounded-card border p-4 text-left ${
              step === index + 1 ? "border-primary bg-blue-50" : "border-neutral-200 bg-white"
            }`}
            onClick={() => setStep(index + 1)}
          >
            <p className="text-xs font-black uppercase text-neutral-400">Step {index + 1}</p>
            <p className="mt-1 font-bold text-neutral-900">{label}</p>
          </button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{step === 1 ? "Select Exam" : step === 2 ? "Select Batch" : "Review Assignment"}</CardTitle>
        </CardHeader>
        <CardContent>
          {step === 1 && selectedExam ? <Select label="Exam" options={examOptions} defaultValue={selectedExam.id} /> : null}
          {step === 2 && selectedBatch ? <Select label="Batch" options={batchOptions} defaultValue={selectedBatch.id} /> : null}
          {step === 3 && selectedExam && selectedBatch ? (
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="rounded-card border border-neutral-200 p-4">
                <p className="text-xs font-black uppercase text-neutral-400">Exam Summary</p>
                <p className="mt-2 font-bold text-neutral-900">{selectedExam.name}</p>
                <p className="mt-1 text-sm text-neutral-500">
                  {selectedExam.questions_count} questions, {selectedExam.duration_minutes} minutes, {selectedExam.total_marks} marks
                </p>
              </div>
              <div className="rounded-card border border-neutral-200 p-4">
                <p className="text-xs font-black uppercase text-neutral-400">Batch</p>
                <p className="mt-2 font-bold text-neutral-900">{selectedBatch.name}</p>
                <p className="mt-1 text-sm text-neutral-500">{selectedBatch.studentsCount} students</p>
              </div>
              <div className="rounded-card border border-neutral-200 p-4">
                <p className="text-xs font-black uppercase text-neutral-400">Status</p>
                <div className="mt-2">
                  <Badge tone="warning">Scheduled</Badge>
                </div>
                <p className="mt-2 text-sm text-neutral-500">Opens tomorrow at 9:00 AM</p>
              </div>
            </div>
          ) : null}
          <div className="mt-6 flex flex-wrap justify-end gap-2">
            {step > 1 ? (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            ) : null}
            {step < 3 ? (
              <Button onClick={() => setStep(step + 1)}>Continue</Button>
            ) : (
              <Button onClick={() => setSuccess(true)}>
                <Send className="h-4 w-4" />
                Assign Exam
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Modal title="Exam Assigned Successfully" open={success}>
        <div className="text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-success" />
          {selectedExam ? <p className="mt-4 font-bold text-neutral-900">{selectedExam.name}</p> : null}
          {selectedBatch ? (
            <p className="mt-2 text-sm text-neutral-500">
              The exam is now visible to {selectedBatch.studentsCount} students in {selectedBatch.name}.
            </p>
          ) : null}
        </div>
      </Modal>
    </div>
  );
}
