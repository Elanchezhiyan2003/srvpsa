import { ClipboardCheck } from "lucide-react";
import { AssignmentWizard } from "@/components/forms/assignment-wizard";
import { DataTable } from "@/components/data-table";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui";
import { assignments } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export default function AssignmentsPage() {
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
          { key: "examName", header: "Exam" },
          { key: "batchName", header: "Batch" },
          { key: "studentsCount", header: "Students Count" },
          { key: "assignedDate", header: "Assigned Date", render: (row) => formatDate(row.assignedDate) },
          { key: "status", header: "Status", render: (row) => <Badge>{row.status}</Badge> }
        ]}
      />
    </div>
  );
}
