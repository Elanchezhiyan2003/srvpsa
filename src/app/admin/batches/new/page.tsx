import { Layers3 } from "lucide-react";
import { BatchDateValidationCard, BatchForm } from "@/components/forms/batch-form";
import { PageHeader } from "@/components/page-header";

export default function CreateBatchPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Batch"
        description="Define the batch name, description, and date range before assigning students and exams."
        icon={Layers3}
      />
      <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
        <BatchForm />
        <BatchDateValidationCard />
      </div>
    </div>
  );
}
