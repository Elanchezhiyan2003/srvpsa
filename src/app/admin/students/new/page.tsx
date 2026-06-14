import { UserPlus } from "lucide-react";
import { StudentForm } from "@/components/forms/student-form";
import { PageHeader } from "@/components/page-header";

export default function AddStudentPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Add Student"
        description="Create a student login, assign a batch, and validate email, mobile number, and password strength."
        icon={UserPlus}
      />
      <StudentForm />
    </div>
  );
}
