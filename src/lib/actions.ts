"use server";

import {
  assignmentSchema,
  batchSchema,
  examSchema,
  loginSchema,
  studentSchema
} from "@/lib/validations";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function loginAction(formData: FormData) {
  const payload = loginSchema.parse({
    email: formData.get("email"),
    password: formData.get("password")
  });

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: payload.email,
    password: payload.password
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  return { ok: true, message: `Authenticated ${payload.email}` };
}

export async function createBatchAction(formData: FormData) {
  const payload = batchSchema.parse(Object.fromEntries(formData));
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("batches").insert({
    name: payload.name,
    description: payload.description,
    start_date: payload.startDate,
    end_date: payload.endDate,
    status: "UPCOMING"
  });
  if (error) return { ok: false, message: error.message };
  return { ok: true, message: `${payload.name} created successfully` };
}

export async function createStudentAction(formData: FormData) {
  const payload = studentSchema.parse(Object.fromEntries(formData));
  const supabase = await createServerSupabaseClient();

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: payload.email,
    password: payload.password
  });

  if (authError || !authData.user) {
    return { ok: false, message: authError?.message ?? "Failed to create auth account" };
  }

  const { error: userError } = await supabase.from("users").insert({
    auth_id: authData.user.id,
    full_name: payload.fullName,
    email: payload.email,
    mobile: payload.mobile,
    role: "STUDENT"
  });

  if (userError) return { ok: false, message: userError.message };

  const { data: userData } = await supabase
    .from("users")
    .select("id")
    .eq("email", payload.email)
    .maybeSingle();

  if (userData) {
    const rollNumber = "TNPSCE" + String(Date.now()).slice(-4);
    await supabase.from("students").insert({
      user_id: userData.id,
      batch_id: payload.batchId,
      roll_number: rollNumber
    });
  }

  return { ok: true, message: `${payload.fullName} added successfully` };
}

export async function createExamAction(formData: FormData) {
  const payload = examSchema.parse(Object.fromEntries(formData));
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("exams").insert({
    name: payload.name,
    description: payload.description,
    duration_minutes: payload.duration,
    total_marks: payload.totalMarks,
    passing_marks: payload.passingMarks,
    negative_marks: payload.negativeMarks,
    status: "DRAFT",
    subject: "General"
  });
  if (error) return { ok: false, message: error.message };
  return { ok: true, message: `${payload.name} saved successfully` };
}

export async function assignExamAction(formData: FormData) {
  const payload = assignmentSchema.parse(Object.fromEntries(formData));
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("exam_assignments").insert({
    exam_id: payload.examId,
    batch_id: payload.batchId,
    opens_at: new Date(Date.now() + 86400000).toISOString(),
    closes_at: new Date(Date.now() + 2 * 86400000).toISOString()
  });
  if (error) return { ok: false, message: error.message };
  return { ok: true, message: `Exam ${payload.examId} assigned to ${payload.batchId}` };
}
