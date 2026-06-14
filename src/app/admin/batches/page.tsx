import Link from "next/link";
import { Edit, Eye, Filter, Plus, Trash2 } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { PageHeader } from "@/components/page-header";
import { Badge, Button, EmptyState, SearchBar, Select } from "@/components/ui";
import { batches } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export default function BatchListPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Batches"
        description="Create, filter, sort, and manage academy batches with student counts and lifecycle status."
        actions={
          <Link href="/admin/batches/new">
            <Button>
              <Plus className="h-4 w-4" />
              Create
            </Button>
          </Link>
        }
      />

      <div className="grid gap-3 lg:grid-cols-[1fr_180px_180px]">
        <SearchBar placeholder="Search batches" />
        <Select
          aria-label="Filter status"
          options={[
            { label: "All Status", value: "all" },
            { label: "Active", value: "active" },
            { label: "Upcoming", value: "upcoming" }
          ]}
        />
        <Button variant="outline">
          <Filter className="h-4 w-4" />
          Sort
        </Button>
      </div>

      <DataTable
        rows={batches}
        columns={[
          { key: "name", header: "Batch Name" },
          { key: "studentsCount", header: "Students Count" },
          { key: "startDate", header: "Start Date", render: (row) => formatDate(row.startDate) },
          { key: "endDate", header: "End Date", render: (row) => formatDate(row.endDate) },
          { key: "status", header: "Status", render: (row) => <Badge>{row.status}</Badge> },
          {
            key: "actions",
            header: "Quick Actions",
            render: () => (
              <div className="flex gap-1">
                <Button size="icon" variant="ghost" aria-label="View batch">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" aria-label="Edit batch">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" aria-label="Delete batch">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )
          }
        ]}
        actions={false}
      />

      <EmptyState
        title="No batches found"
        description="Adjust the search or create a new preparation batch."
        action={
          <Link href="/admin/batches/new">
            <Button>Create Batch</Button>
          </Link>
        }
      />
    </div>
  );
}
