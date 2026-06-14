import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { LoginForm } from "@/components/forms/login-form";

export default function AdminLoginPage() {
  return (
    <main className="grid min-h-screen bg-neutral-50 px-4 py-8 lg:grid-cols-[0.95fr_1.05fr]">
      <section className="mx-auto flex w-full max-w-xl flex-col justify-center">
        <Link href="/" className="mb-8 inline-flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-button bg-primary text-white">
            <GraduationCap className="h-6 w-6" />
          </span>
          <span className="text-base font-black text-neutral-900">TNPSCE Academy</span>
        </Link>
        <LoginForm portal="admin" />
      </section>
      <section className="hidden rounded-card bg-neutral-900 p-8 text-white lg:flex lg:flex-col lg:justify-end">
        <p className="max-w-xl text-4xl font-black leading-tight">
          Manage every examination workflow from one operational command center.
        </p>
        <div className="mt-8 grid grid-cols-3 gap-3">
          {["500 Students", "50 Exams", "10 Batches"].map((item) => (
            <div key={item} className="rounded-card bg-white/10 p-4">
              <p className="text-sm font-bold">{item}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
