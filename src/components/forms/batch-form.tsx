"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarCheck, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Textarea, Toast } from "@/components/ui";
import { batchSchema, type BatchInput } from "@/lib/validations";

export function BatchForm() {
  const [saved, setSaved] = useState(false);
  const form = useForm<BatchInput>({
    resolver: zodResolver(batchSchema),
    defaultValues: {
      name: "TNPSC Group II Evening Batch",
      description: "Weekday evening preparation batch for Group II preliminary exam.",
      startDate: "2026-07-01",
      endDate: "2026-11-30"
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Batch</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="grid gap-5 lg:grid-cols-2"
          onSubmit={form.handleSubmit(() => {
            setSaved(true);
          })}
        >
          <Input label="Batch Name" error={form.formState.errors.name?.message} {...form.register("name")} />
          <Input
            label="Start Date"
            type="date"
            error={form.formState.errors.startDate?.message}
            {...form.register("startDate")}
          />
          <Input
            label="End Date"
            type="date"
            error={form.formState.errors.endDate?.message}
            {...form.register("endDate")}
          />
          <div className="lg:col-span-2">
            <Textarea
              label="Description"
              error={form.formState.errors.description?.message}
              {...form.register("description")}
            />
          </div>
          {saved ? (
            <div className="lg:col-span-2">
              <Toast message="Batch saved successfully." />
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

export function BatchDateValidationCard() {
  return (
    <Card className="p-5">
      <CalendarCheck className="h-5 w-5 text-primary" />
      <p className="mt-3 font-bold text-neutral-900">Date validation enabled</p>
      <p className="mt-2 text-sm leading-6 text-neutral-500">
        End dates are checked against the selected start date before saving.
      </p>
    </Card>
  );
}
