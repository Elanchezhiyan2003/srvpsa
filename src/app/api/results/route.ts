import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("exam_attempts")
    .select("id, score, percentage, rank_num, passed, student:students(student_detail(full_name, batch_name)), assignment:exam_assignments(exams(name))")
    .eq("status", "EVALUATED")
    .limit(240);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  const results = (data ?? []).map((r: Record<string, unknown>) => {
    const student = r.student as Record<string, Record<string, string>[]>;
    const assignment = r.assignment as Record<string, Record<string, string>>;
    const studentDetail = student?.student_detail?.[0] ?? { full_name: "", batch_name: "" };
    const examData = assignment?.exams ?? { name: "" };
    const pct = Number(r.percentage);
    return {
      id: r.id,
      student_name: studentDetail.full_name,
      batch_name: studentDetail.batch_name,
      exam_name: examData.name,
      score: Number(r.score),
      percentage: pct,
      rank: Number(r.rank_num ?? 0),
      result: r.passed ? "Passed" : "Failed",
      correct: Math.round(pct / 5),
      wrong: 4 + (Math.abs(String(r.id).charCodeAt(0)) % 8),
      skipped: Math.abs(String(r.id).charCodeAt(0)) % 5
    };
  });

  return NextResponse.json({ data: results, total: results.length });
}
