import { AppShell } from "@/components/app-shell";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return <AppShell portal="student">{children}</AppShell>;
}
