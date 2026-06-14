import { Save, Settings } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Select } from "@/components/ui";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Configure academy identity, authentication policy, notifications, and exam safeguards."
        icon={Settings}
      />
      <div className="grid gap-5 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Academy Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input label="Platform Name" defaultValue="TNPSCE Academy Examination Platform" />
            <Input label="Support Email" defaultValue="support@tnpsce.academy" />
            <Select
              label="Default Time Zone"
              options={[
                { label: "Asia/Kolkata", value: "Asia/Kolkata" },
                { label: "UTC", value: "UTC" }
              ]}
            />
            <Button>
              <Save className="h-4 w-4" />
              Save
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Exam Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              "Fullscreen mode required",
              "Auto-save answers every 20 seconds",
              "Block submit with unanswered review warning",
              "Network status detection enabled"
            ].map((label) => (
              <label key={label} className="flex items-center justify-between rounded-card border border-neutral-200 p-4">
                <span className="text-sm font-bold text-neutral-700">{label}</span>
                <input type="checkbox" defaultChecked className="h-5 w-5 accent-primary" />
              </label>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
