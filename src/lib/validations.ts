import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(3, "Email or mobile is required"),
  password: z.string().min(8, "Password must be at least 8 characters")
});

export const batchSchema = z
  .object({
    name: z.string().min(3, "Batch name is required"),
    description: z.string().min(10, "Description must be meaningful"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required")
  })
  .refine((value) => new Date(value.endDate) > new Date(value.startDate), {
    message: "End date must be after start date",
    path: ["endDate"]
  });

export const studentSchema = z.object({
  fullName: z.string().min(3, "Full name is required"),
  email: z.string().email("Enter a valid email"),
  mobile: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid Indian mobile number"),
  batchId: z.string().min(1, "Select a batch"),
  password: z
    .string()
    .min(8, "Use at least 8 characters")
    .regex(/[A-Z]/, "Add an uppercase letter")
    .regex(/[0-9]/, "Add a number")
});

export const examSchema = z.object({
  name: z.string().min(3, "Exam name is required"),
  description: z.string().min(10, "Description is required"),
  duration: z.coerce.number().min(10, "Duration must be at least 10 minutes"),
  totalMarks: z.coerce.number().min(1, "Total marks required"),
  passingMarks: z.coerce.number().min(1, "Passing marks required"),
  negativeMarks: z.coerce.number().min(0, "Negative marks cannot be below zero")
});

export const assignmentSchema = z.object({
  examId: z.string().min(1, "Select an exam"),
  batchId: z.string().min(1, "Select a batch")
});

export type LoginInput = z.infer<typeof loginSchema>;
export type BatchInput = z.infer<typeof batchSchema>;
export type StudentInput = z.infer<typeof studentSchema>;
export type ExamFormInput = z.input<typeof examSchema>;
export type ExamInput = z.output<typeof examSchema>;
export type AssignmentInput = z.infer<typeof assignmentSchema>;
