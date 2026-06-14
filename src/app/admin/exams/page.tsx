import Link from "next/link";
import { Copy, Edit, Plus, Trash2 } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { PageHeader } from "@/components/page-header";
import { Badge, Button, SearchBar, Select, Tabs } from "@/components/ui";
import { exams } from "@/lib/data";

export default function ExamListPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Exams"
        description="Manage exam drafts, published papers, live tests, and completed assessments."
        actions={
          <Link href="/admin/exams/new">
            <Button>
              <Plus className="h-4 w-4" />
              Create
            </Button>
          </Link>
        }
      />
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <Tabs tabs={["All", "Draft", "Published", "Active", "Closed"]} active="All" />
        <div className="grid gap-3 md:grid-cols-[260px_180px]">
          <SearchBar placeholder="Search exams" />
          <Select
            aria-label="Filter subject"
            options={[
              { label: "All Subjects", value: "all" },
              { label: "Indian Polity", value: "polity" },
              { label: "Aptitude", value: "aptitude" }
            ]}
          />
        </div>
      </div>
      <DataTable
        rows={exams.slice(0, 12)}
        columns={[
          { key: "name", header: "Exam Name" },
          { key: "questions", header: "Questions" },
          { key: "duration", header: "Duration", render: (row) => `${row.duration} min` },
          { key: "totalMarks", header: "Marks" },
          { key: "status", header: "Status", render: (row) => <Badge>{row.status}</Badge> },
          {
            key: "actions",
            header: "Actions",
            render: () => (
              <div className="flex gap-1">
                <Button size="icon" variant="ghost" aria-label="Edit exam">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" aria-label="Duplicate exam">
                  <Copy className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" aria-label="Delete exam">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )
          }
        ]}
        actions={false}
      />
    </div>
  );
}
