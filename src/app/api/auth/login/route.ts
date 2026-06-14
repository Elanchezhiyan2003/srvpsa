import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { loginSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, errors: parsed.error.flatten() }, { status: 400 });
  }

  const supabase = await createServerSupabaseClient();
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password
  });

  if (authError || !authData.user) {
    return NextResponse.json({ ok: false, error: "Invalid credentials" }, { status: 401 });
  }

  const { data: userData } = await supabase
    .from("users")
    .select("id, full_name, email, role")
    .eq("email", parsed.data.email)
    .maybeSingle();

  return NextResponse.json({
    ok: true,
    user: userData ? { id: userData.id, name: userData.full_name, email: userData.email, role: userData.role } : null
  });
}
