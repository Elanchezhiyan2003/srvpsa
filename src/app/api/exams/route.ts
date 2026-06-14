import { NextResponse } from "next/server";
import { exams } from "@/lib/data";

export function GET() {
  return NextResponse.json({
    data: exams,
    total: exams.length
  });
}
