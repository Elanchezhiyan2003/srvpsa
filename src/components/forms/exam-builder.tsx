"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowDownUp,
  CopyPlus,
  FileUp,
  Plus,
  Save,
  Send,
  Trash2
} from "lucide-react";
import { useForm } from "react-hook-form";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Select,
  Tabs,
  Textarea,
  Toast
} from "@/components/ui";
import { activeExamQuestions } from "@/lib/data";
import { examSchema, type ExamFormInput } from "@/lib/validations";

export function ExamBuilder() {
  const [activeTab, setActiveTab] = useState("Basic Details");
  const [published, setPublished] = useState(false);
  const form = useForm<ExamFormInput>({
    resolver: zodResolver(examSchema),
    defaultValues: {
      name: "Indian Polity Grand Mock Test",
      description: "Comprehensive polity mock test with current constitutional amendments.",
      duration: 60,
      totalMarks: 80,
      passingMarks: 36,
      negativeMarks: 0.25
    }
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {["Basic Details", "Question Builder", "Preview"].map((tab) => (
          <Button
            key={tab}
            type="button"
            variant={activeTab === tab ? "primary" : "outline"}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </Button>
        ))}
      </div>

      {activeTab === "Basic Details" ? (
        <Card>
          <CardHeader>
            <CardTitle>Basic Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid gap-5 lg:grid-cols-2" onSubmit={form.handleSubmit(() => setPublished(true))}>
              <Input label="Exam Name" error={form.formState.errors.name?.message} {...form.register("name")} />
              <Input
                label="Duration"
                type="number"
                error={form.formState.errors.duration?.message}
                {...form.register("duration")}
              />
              <Input
                label="Total Marks"
                type="number"
                error={form.formState.errors.totalMarks?.message}
                {...form.register("totalMarks")}
              />
              <Input
                label="Passing Marks"
                type="number"
                error={form.formState.errors.passingMarks?.message}
                {...form.register("passingMarks")}
              />
              <Input
                label="Negative Marks"
                type="number"
                step="0.25"
                error={form.formState.errors.negativeMarks?.message}
                {...form.register("negativeMarks")}
              />
              <Select
                label="Subject"
                options={[
                  { label: "Indian Polity", value: "polity" },
                  { label: "Current Affairs", value: "current-affairs" },
                  { label: "Aptitude", value: "aptitude" }
                ]}
              />
              <div className="lg:col-span-2">
                <Textarea
                  label="Description"
                  error={form.formState.errors.description?.message}
                  {...form.register("description")}
                />
              </div>
              {published ? (
                <div className="lg:col-span-2">
                  <Toast message="Exam details saved." />
                </div>
              ) : null}
              <div className="flex flex-wrap justify-end gap-2 lg:col-span-2">
                <Button variant="outline" type="button">
                  <Save className="h-4 w-4" />
                  Save Draft
                </Button>
                <Button type="submit">
                  <Send className="h-4 w-4" />
                  Publish Exam
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : null}

      {activeTab === "Question Builder" ? <QuestionBuilderPanel /> : null}
      {activeTab === "Preview" ? <ExamPreview /> : null}
    </div>
  );
}

function QuestionBuilderPanel() {
  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle>Question Builder</CardTitle>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">
                <FileUp className="h-4 w-4" />
                Bulk Import
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            label="Question"
            defaultValue="Which of the following statements correctly describes the Directive Principles of State Policy?"
          />
          <div className="grid gap-3 md:grid-cols-2">
            {["A", "B", "C", "D"].map((label, index) => (
              <Input
                key={label}
                label={`Option ${label}`}
                defaultValue={[
                  "They are justiciable in all courts",
                  "They guide the state in policy making",
                  "They are enforceable as fundamental rights",
                  "They apply only to union territories"
                ][index]}
              />
            ))}
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <Select
              label="Question Type"
              options={[
                { label: "MCQ", value: "mcq" },
                { label: "MSQ", value: "msq" },
                { label: "True/False", value: "tf" }
              ]}
            />
            <Select
              label="Correct Answer"
              options={[
                { label: "Option B", value: "b" },
                { label: "Options A and B", value: "a-b" }
              ]}
            />
            <Input label="Marks" type="number" defaultValue="2" />
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            <Button variant="outline">
              <CopyPlus className="h-4 w-4" />
              Add Option
            </Button>
            <Button variant="outline">
              <ArrowDownUp className="h-4 w-4" />
              Reorder
            </Button>
            <Button variant="danger">
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Question Set</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {activeExamQuestions.slice(0, 8).map((question, index) => (
            <button
              key={question.id}
              className="w-full rounded-card border border-neutral-200 p-3 text-left transition hover:border-primary/40 hover:bg-blue-50"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-bold text-neutral-900">Q{index + 1}</span>
                <Badge>{question.type}</Badge>
              </div>
              <p className="mt-2 line-clamp-2 text-xs leading-5 text-neutral-500">{question.prompt}</p>
            </button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function ExamPreview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-5 grid gap-3 md:grid-cols-4">
          {[
            ["Duration", "60 min"],
            ["Questions", "40"],
            ["Marks", "80"],
            ["Negative", "0.25"]
          ].map(([label, value]) => (
            <div key={label} className="rounded-card bg-neutral-50 p-4">
              <p className="text-xs font-bold uppercase text-neutral-400">{label}</p>
              <p className="mt-1 text-xl font-black text-neutral-900">{value}</p>
            </div>
          ))}
        </div>
        <Tabs tabs={["All", "MCQ", "MSQ", "True/False"]} active="All" />
        <div className="mt-5 space-y-3">
          {activeExamQuestions.slice(0, 5).map((question, index) => (
            <div key={question.id} className="rounded-card border border-neutral-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-bold text-neutral-900">Question {index + 1}</p>
                <Badge>{question.type}</Badge>
              </div>
              <p className="mt-2 text-sm leading-6 text-neutral-600">{question.prompt}</p>
              <div className="mt-3 grid gap-2 md:grid-cols-2">
                {question.options.map((option) => (
                  <div key={option.id} className="rounded-button border border-neutral-200 px-3 py-2 text-sm">
                    {option.label}. {option.value}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
