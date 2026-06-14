import type { Role, SessionUser } from "@/lib/types";

export const demoUsers: Record<"admin" | "student", SessionUser> = {
  admin: {
    id: "admin-1",
    name: "Priya Raman",
    email: "admin@tnpsce.academy",
    role: "SUPER_ADMIN"
  },
  student: {
    id: "student-19",
    name: "Meena Murugan",
    email: "student@tnpsce.academy",
    role: "STUDENT"
  }
};

export function canAccess(role: Role, area: "admin" | "student") {
  if (area === "admin") {
    return role === "SUPER_ADMIN" || role === "ADMIN";
  }
  return role === "STUDENT";
}

export const batchStatusLabel: Record<string, string> = {
  UPCOMING: "Upcoming",
  ACTIVE: "Active",
  COMPLETED: "Completed",
  ARCHIVED: "Archived"
};

export const examStatusLabel: Record<string, string> = {
  DRAFT: "Draft",
  PUBLISHED: "Published",
  ACTIVE: "Active",
  CLOSED: "Closed"
};

export const questionTypeLabel: Record<string, string> = {
  MCQ: "MCQ",
  MSQ: "MSQ",
  TRUE_FALSE: "True/False"
};
