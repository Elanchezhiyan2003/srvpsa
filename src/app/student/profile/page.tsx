import { History, LockKeyhole, Save, UserCircle } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { PageHeader } from "@/components/page-header";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Input } from "@/components/ui";
import { getCurrentStudent, getStudentResults } from "@/lib/data";

export default async function ProfilePage() {
  const student = await getCurrentStudent();

  if (!student) {
    return <div>Student not found</div>;
  }

  const studentResults = await getStudentResults(student.student_id);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile"
        description="Manage personal information, update password, and review exam history."
        icon={UserCircle}
      />
      <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Input label="Full Name" defaultValue={student.full_name} />
            <Input label="Email" defaultValue={student.email} />
            <Input label="Mobile" defaultValue={student.mobile || ""} />
            <Input label="Batch" defaultValue={student.batch_name} />
            <div className="md:col-span-2">
              <Button>
                <Save className="h-4 w-4" />
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input label="Current Password" type="password" defaultValue="Password123" />
            <Input label="New Password" type="password" defaultValue="Password456" />
            <Input label="Confirm Password" type="password" defaultValue="Password456" />
            <Button variant="secondary">
              <LockKeyhole className="h-4 w-4" />
              Update Password
            </Button>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            <CardTitle>Exam History</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            rows={studentResults}
            columns={[
              { key: "exam_name", header: "Exam" },
              { key: "score", header: "Score" },
              { key: "percentage", header: "Percentage", render: (row) => `${row.percentage}%` },
              { key: "rank", header: "Rank", render: (row) => `#${row.rank}` },
              { key: "result", header: "Result", render: (row) => <Badge>{row.result}</Badge> }
            ]}
          />
        </CardContent>
      </Card>
    </div>
  );
}
