import { NextResponse } from "next/server";
import { createJwt, demoUsers } from "@/lib/auth";
import { loginSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, errors: parsed.error.flatten() }, { status: 400 });
  }

  const user = parsed.data.email.includes("student") ? demoUsers.student : demoUsers.admin;
  const token = await createJwt(user);

  return NextResponse.json({ ok: true, user, token });
}
