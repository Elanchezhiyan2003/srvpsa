import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Badge, Button, Card } from "@/components/ui";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

export function DataTable<T extends { id: string }>({
  columns,
  rows,
  actions = true
}: {
  columns: Column<T>[];
  rows: T[];
  actions?: boolean;
}) {
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-sm">
          <thead className="bg-neutral-50 text-left text-xs uppercase text-neutral-500">
            <tr>
              {columns.map((column) => (
                <th key={String(column.key)} className={cn("px-5 py-4 font-bold", column.className)}>
                  {column.header}
                </th>
              ))}
              {actions ? <th className="px-5 py-4 text-right font-bold">Actions</th> : null}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {rows.map((row) => (
              <tr key={row.id} className="bg-white transition hover:bg-blue-50/35">
                {columns.map((column) => {
                  const raw = row[column.key as keyof T];
                  const isStatus = String(column.key).toLowerCase().includes("status");
                  return (
                    <td key={String(column.key)} className={cn("px-5 py-4 text-neutral-700", column.className)}>
                      {column.render ? column.render(row) : isStatus ? <Badge>{String(raw)}</Badge> : String(raw)}
                    </td>
                  );
                })}
                {actions ? (
                  <td className="px-5 py-4 text-right">
                    <Button variant="ghost" size="icon" aria-label="Open row actions">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100 px-5 py-4">
        <p className="text-sm font-medium text-neutral-500">Showing 1-10 of {rows.length}</p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <ChevronLeft className="h-4 w-4" />
            Prev
          </Button>
          <Button variant="outline" size="sm">
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
