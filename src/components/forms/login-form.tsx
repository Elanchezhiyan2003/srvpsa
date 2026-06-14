"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button, Card, CardContent, CardHeader, CardTitle, ErrorState, Input, Toast } from "@/components/ui";
import { useAuthStore } from "@/store/use-auth-store";
import { loginSchema, type LoginInput } from "@/lib/validations";

export function LoginForm({ portal }: { portal: "admin" | "student" }) {
  const router = useRouter();
  const { login, isLoading, error } = useAuthStore();
  const [success, setSuccess] = useState(false);
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: portal === "admin" ? "admin@tnpsce.academy" : "student@tnpsce.academy",
      password: "Password123"
    }
  });

  async function onSubmit(values: LoginInput) {
    const ok = await login(portal, values.email, values.password);
    if (!ok) return;
    setSuccess(true);
    setTimeout(() => {
      router.push(portal === "admin" ? "/admin/dashboard" : "/student/dashboard");
    }, 350);
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="mb-4 grid h-12 w-12 place-items-center rounded-button bg-blue-50 text-primary">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <CardTitle className="text-2xl">{portal === "admin" ? "Admin Login" : "Student Login"}</CardTitle>
        <p className="mt-2 text-sm leading-6 text-neutral-500">
          {portal === "admin"
            ? "Access batches, students, assignments, and result analytics."
            : "Attend assigned exams and review your performance history."}
        </p>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="relative">
            <Mail className="absolute left-3 top-10 h-4 w-4 text-neutral-400" />
            <Input
              label={portal === "admin" ? "Email" : "Email or Mobile"}
              className="pl-9"
              error={form.formState.errors.email?.message}
              {...form.register("email")}
            />
          </div>
          <div className="relative">
            <LockKeyhole className="absolute left-3 top-10 h-4 w-4 text-neutral-400" />
            <Input
              label="Password"
              type="password"
              className="pl-9"
              error={form.formState.errors.password?.message}
              {...form.register("password")}
            />
          </div>
          {error ? <ErrorState message={error} /> : null}
          {success ? <Toast message="Login successful. Redirecting..." /> : null}
          <Button type="submit" className="w-full" isLoading={isLoading}>
            Login
          </Button>
          <button type="button" className="w-full text-center text-sm font-bold text-primary">
            Forgot Password
          </button>
        </form>
      </CardContent>
    </Card>
  );
}
