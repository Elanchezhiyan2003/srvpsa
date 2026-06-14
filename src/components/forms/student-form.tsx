"use client";

import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileSpreadsheet, Save, Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Select, Toast } from "@/components/ui";
import { batches } from "@/lib/data";
import { studentSchema, type StudentInput } from "@/lib/validations";

export function StudentForm() {
  const [saved, setSaved] = useState(false);
  const batchOptions = useMemo(
    () => [
      { label: "Select batch", value: "" },
      ...batches.map((batch) => ({ label: batch.name, value: batch.id }))
    ],
    []
  );
  const form = useForm<StudentInput>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      fullName: "Rohini Subramanian",
      email: "rohini.subramanian@tnpsce.academy",
      mobile: "9876543210",
      batchId: batches[0].id,
      password: "Password123"
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Student</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="grid gap-5 lg:grid-cols-2"
          onSubmit={form.handleSubmit(() => {
            setSaved(true);
          })}
        >
          <Input label="Full Name" error={form.formState.errors.fullName?.message} {...form.register("fullName")} />
          <Input label="Email" error={form.formState.errors.email?.message} {...form.register("email")} />
          <Input label="Mobile Number" error={form.formState.errors.mobile?.message} {...form.register("mobile")} />
          <Select
            label="Batch"
            options={batchOptions}
            error={form.formState.errors.batchId?.message}
            {...form.register("batchId")}
          />
          <Input
            label="Password"
            type="password"
            error={form.formState.errors.password?.message}
            {...form.register("password")}
          />
          <div className="rounded-card border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-sm font-bold text-emerald-800">Password strength</p>
            <div className="mt-3 h-2 rounded-full bg-emerald-100">
              <div className="h-2 w-4/5 rounded-full bg-success" />
            </div>
          </div>
          {saved ? (
            <div className="lg:col-span-2">
              <Toast message="Student added successfully." />
            </div>
          ) : null}
          <div className="flex flex-wrap justify-end gap-2 lg:col-span-2">
            <Button variant="outline" type="button">
              Cancel
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4" />
              Save
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export function CsvUploadPreview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bulk Upload</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-card border border-dashed border-neutral-300 bg-neutral-50 p-6 text-center">
          <Upload className="mx-auto h-8 w-8 text-primary" />
          <p className="mt-3 font-bold text-neutral-900">CSV Upload</p>
          <p className="mt-1 text-sm text-neutral-500">student_name,email,mobile,batch,password</p>
          <Button className="mt-4" variant="outline">
            <FileSpreadsheet className="h-4 w-4" />
            Select CSV
          </Button>
        </div>
        <div className="mt-5 overflow-hidden rounded-card border border-neutral-200">
          {[
            ["Valid records", "84", "success"],
            ["Duplicate emails", "2", "warning"],
            ["Invalid mobile numbers", "1", "danger"]
          ].map(([label, value, tone]) => (
            <div key={label} className="flex items-center justify-between border-b border-neutral-100 px-4 py-3 last:border-0">
              <span className="text-sm font-semibold text-neutral-600">{label}</span>
              <span className={`text-sm font-black ${tone === "success" ? "text-success" : tone === "warning" ? "text-warning" : "text-danger"}`}>
                {value}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
