import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    ok: true,
    service: "TNPSCE Academy Examination Platform",
    timestamp: new Date().toISOString()
  });
}
