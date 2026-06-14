import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui";
import { cn } from "@/lib/utils";

export function StatsCard({
  label,
  value,
  helper,
  icon: Icon,
  tone = "primary"
}: {
  label: string;
  value: string | number;
  helper: string;
  icon: LucideIcon;
  tone?: "primary" | "secondary" | "success" | "warning";
}) {
  const tones = {
    primary: "bg-blue-50 text-primary",
    secondary: "bg-orange-50 text-secondary",
    success: "bg-emerald-50 text-success",
    warning: "bg-amber-50 text-warning"
  };

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-neutral-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-neutral-900">{value}</p>
          <p className="mt-2 text-sm text-neutral-500">{helper}</p>
        </div>
        <span className={cn("grid h-11 w-11 place-items-center rounded-button", tones[tone])}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </Card>
  );
}
