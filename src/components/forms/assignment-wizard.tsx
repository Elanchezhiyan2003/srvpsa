"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Modal, Select } from "@/components/ui";
import { batches, exams } from "@/lib/data";

export function AssignmentWizard() {
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);
  const selectedExam = exams[1];
  const selectedBatch = batches[2];
  const examOptions = useMemo(
    () => exams.slice(0, 10).map((exam) => ({ label: exam.name, value: exam.id })),
    []
  );
  const batchOptions = useMemo(
    () => batches.map((batch) => ({ label: batch.name, value: batch.id })),
    []
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
          {step === 1 ? <Select label="Exam" options={examOptions} defaultValue={selectedExam.id} /> : null}
          {step === 2 ? <Select label="Batch" options={batchOptions} defaultValue={selectedBatch.id} /> : null}
          {step === 3 ? (
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="rounded-card border border-neutral-200 p-4">
                <p className="text-xs font-black uppercase text-neutral-400">Exam Summary</p>
                <p className="mt-2 font-bold text-neutral-900">{selectedExam.name}</p>
                <p className="mt-1 text-sm text-neutral-500">
                  {selectedExam.questions} questions, {selectedExam.duration} minutes, {selectedExam.totalMarks} marks
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
          <p className="mt-4 font-bold text-neutral-900">{selectedExam.name}</p>
          <p className="mt-2 text-sm text-neutral-500">
            The exam is now visible to {selectedBatch.studentsCount} students in {selectedBatch.name}.
          </p>
        </div>
      </Modal>
    </div>
  );
}
