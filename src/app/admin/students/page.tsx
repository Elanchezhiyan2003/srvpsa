import Link from "next/link";
import { Download, Edit, Eye, Filter, Plus, Trash2 } from "lucide-react";
import { CsvUploadPreview } from "@/components/forms/student-form";
import { DataTable } from "@/components/data-table";
import { PageHeader } from "@/components/page-header";
import { Badge, Button, SearchBar, Select } from "@/components/ui";
import { getBatches, getStudents } from "@/lib/data";

export default async function StudentManagementPage() {
  const [batches, students] = await Promise.all([
    getBatches(),
    getStudents()
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Management"
        description="Search, filter, export, add, edit, delete, view, and bulk upload student records."
        actions={
          <>
            <Button variant="outline">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Link href="/admin/students/new">
              <Button>
                <Plus className="h-4 w-4" />
                Add Student
              </Button>
            </Link>
          </>
        }
      />
      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <div className="grid gap-3 lg:grid-cols-[1fr_220px_140px]">
            <SearchBar placeholder="Search students" />
            <Select
              aria-label="Filter by batch"
              options={[
                { label: "All Batches", value: "all" },
                ...batches.map((batch) => ({ label: batch.name, value: batch.id }))
              ]}
            />
            <Button variant="outline">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
          <DataTable
            rows={students.slice(0, 12)}
            columns={[
              { key: "full_name", header: "Student Name" },
              { key: "email", header: "Email" },
              { key: "mobile", header: "Mobile" },
              { key: "batch_name", header: "Batch" },
              { key: "is_active", header: "Status", render: (row) => <Badge>{row.is_active ? "Active" : "Inactive"}</Badge> },
              {
                key: "quick",
                header: "Actions",
                render: () => (
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" aria-label="View student">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" aria-label="Edit student">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" aria-label="Delete student">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )
              }
            ]}
            actions={false}
          />
        </div>
        <CsvUploadPreview />
      </div>
    </div>
  );
}
