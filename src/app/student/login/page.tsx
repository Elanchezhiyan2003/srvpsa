import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { LoginForm } from "@/components/forms/login-form";

export default function StudentLoginPage() {
  return (
    <main className="grid min-h-screen bg-neutral-50 px-4 py-8 lg:grid-cols-[0.95fr_1.05fr]">
      <section className="mx-auto flex w-full max-w-xl flex-col justify-center">
        <Link href="/" className="mb-8 inline-flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-button bg-primary text-white">
            <GraduationCap className="h-6 w-6" />
          </span>
          <span className="text-base font-black text-neutral-900">TNPSCE Academy</span>
        </Link>
        <LoginForm portal="student" />
      </section>
      <section className="hidden rounded-card bg-white p-8 shadow-soft lg:flex lg:flex-col lg:justify-end">
        <div className="rounded-card bg-blue-50 p-6">
          <p className="text-sm font-bold uppercase text-primary">Today</p>
          <p className="mt-3 text-3xl font-black text-neutral-900">Indian Polity Mock Test 18</p>
          <p className="mt-3 text-sm leading-6 text-neutral-600">
            60 minutes, 40 questions, auto-save enabled, result review available after submission.
          </p>
        </div>
      </section>
    </main>
  );
}
