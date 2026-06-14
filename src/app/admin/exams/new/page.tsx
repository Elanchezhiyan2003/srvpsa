import { BookOpenCheck } from "lucide-react";
import { ExamBuilder } from "@/components/forms/exam-builder";
import { PageHeader } from "@/components/page-header";

export default function CreateExamPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Exam"
        description="Configure exam details, build questions, import content, reorder items, preview, save drafts, and publish."
        icon={BookOpenCheck}
      />
      <ExamBuilder />
    </div>
  );
}
