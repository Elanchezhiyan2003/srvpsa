"use server";

import {
  assignmentSchema,
  batchSchema,
  examSchema,
  loginSchema,
  studentSchema
} from "@/lib/validations";

export async function loginAction(formData: FormData) {
  const payload = loginSchema.parse({
    email: formData.get("email"),
    password: formData.get("password")
  });

  return {
    ok: true,
    message: `Authenticated ${payload.email}`
  };
}

export async function createBatchAction(formData: FormData) {
  const payload = batchSchema.parse(Object.fromEntries(formData));
  return { ok: true, message: `${payload.name} created successfully` };
}

export async function createStudentAction(formData: FormData) {
  const payload = studentSchema.parse(Object.fromEntries(formData));
  return { ok: true, message: `${payload.fullName} added successfully` };
}

export async function createExamAction(formData: FormData) {
  const payload = examSchema.parse(Object.fromEntries(formData));
  return { ok: true, message: `${payload.name} saved successfully` };
}

export async function assignExamAction(formData: FormData) {
  const payload = assignmentSchema.parse(Object.fromEntries(formData));
  return { ok: true, message: `Exam ${payload.examId} assigned to ${payload.batchId}` };
}
