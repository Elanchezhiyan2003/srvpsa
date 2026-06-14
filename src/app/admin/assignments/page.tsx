import { ClipboardCheck } from "lucide-react";
import { AssignmentWizard } from "@/components/forms/assignment-wizard";
import { DataTable } from "@/components/data-table";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui";
import { getAssignments } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export default async function AssignmentsPage() {
  const assignments = await getAssignments();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Assign Exam to Batch"
        description="Select an exam, choose a batch, review the student count and exam summary, then assign."
        icon={ClipboardCheck}
      />
      <AssignmentWizard />
      <DataTable
        rows={assignments}
        columns={[
          { key: "exam_name", header: "Exam" },
          { key: "batch_name", header: "Batch" },
          { key: "students_count", header: "Students Count" },
          { key: "assigned_date", header: "Assigned Date", render: (row) => formatDate(row.assigned_date) },
          { key: "status", header: "Status", render: (row) => <Badge>{row.status}</Badge> }
        ]}
      />
    </div>
  );
}
