"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  BookOpenCheck,
  ClipboardCheck,
  FileBarChart,
  GraduationCap,
  Home,
  Layers3,
  LogOut,
  Menu,
  Search,
  Settings,
  UserCircle,
  Users
} from "lucide-react";
import { Button, SearchBar } from "@/components/ui";
import { initials, cn } from "@/lib/utils";

const adminNav = [
  { href: "/admin/dashboard", label: "Dashboard", icon: Home },
  { href: "/admin/batches", label: "Batches", icon: Layers3 },
  { href: "/admin/students", label: "Students", icon: Users },
  { href: "/admin/exams", label: "Exams", icon: BookOpenCheck },
  { href: "/admin/assignments", label: "Assignments", icon: ClipboardCheck },
  { href: "/admin/results", label: "Results", icon: FileBarChart },
  { href: "/admin/settings", label: "Settings", icon: Settings }
];

const studentNav = [
  { href: "/student/dashboard", label: "Dashboard", icon: Home },
  { href: "/student/exams", label: "Assigned Exams", icon: BookOpenCheck },
  { href: "/student/results", label: "Results", icon: FileBarChart },
  { href: "/student/profile", label: "Profile", icon: UserCircle }
];

export function AppShell({
  portal,
  children
}: {
  portal: "admin" | "student";
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const navItems = portal === "admin" ? adminNav : studentNav;
  const user = portal === "admin" ? "Priya Raman" : "Meena Murugan";
  const role = portal === "admin" ? "Super Admin" : "Student";

  if (pathname.endsWith("/login")) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-neutral-200 bg-white lg:block">
        <div className="flex h-full flex-col">
          <Link href="/" className="flex h-20 items-center gap-3 border-b border-neutral-100 px-6">
            <span className="grid h-11 w-11 place-items-center rounded-button bg-primary text-white">
              <GraduationCap className="h-6 w-6" />
            </span>
            <span>
              <span className="block text-base font-black text-neutral-900">TNPSCE Academy</span>
              <span className="block text-xs font-semibold uppercase text-neutral-400">
                {portal === "admin" ? "Admin Portal" : "Student Portal"}
              </span>
            </span>
          </Link>
          <nav className="flex-1 space-y-1 px-4 py-5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-button px-3 py-2.5 text-sm font-bold text-neutral-500 transition hover:bg-blue-50 hover:text-primary",
                    active && "bg-blue-50 text-primary"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-neutral-100 p-4">
            <div className="flex items-center gap-3 rounded-card bg-neutral-50 p-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-secondary text-sm font-black text-white">
                {initials(user)}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold text-neutral-900">{user}</span>
                <span className="block text-xs font-semibold text-neutral-500">{role}</span>
              </span>
            </div>
          </div>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between gap-4 border-b border-neutral-200 bg-white/90 px-4 backdrop-blur md:px-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
            <SearchBar className="hidden w-[320px] md:block" placeholder="Search batches, exams, students" />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" aria-label="Search">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Notifications">
              <Bell className="h-5 w-5" />
            </Button>
            <Link href={portal === "admin" ? "/admin/login" : "/student/login"}>
              <Button variant="outline" size="sm">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </Link>
          </div>
        </header>
        <main className="mx-auto w-full max-w-[1480px] px-4 py-6 md:px-6 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
