import { NextResponse } from "next/server";
import { results } from "@/lib/data";

export function GET() {
  return NextResponse.json({
    data: results,
    total: results.length
  });
}
