import type { Role } from "@/lib/types";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

const encoder = new TextEncoder();

function base64Url(input: string | ArrayBuffer) {
  const bytes = typeof input === "string" ? encoder.encode(input) : new Uint8Array(input);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

export async function createJwt(payload: SessionUser, secret = process.env.JWT_SECRET ?? "demo-secret") {
  const header = base64Url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = base64Url(JSON.stringify({ ...payload, iat: Date.now() }));
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(`${header}.${body}`));
  return `${header}.${body}.${base64Url(signature)}`;
}

export const demoUsers: Record<"admin" | "student", SessionUser> = {
  admin: {
    id: "admin-1",
    name: "Priya Raman",
    email: "admin@tnpsce.academy",
    role: "SUPER_ADMIN"
  },
  student: {
    id: "student-19",
    name: "Meena Murugan",
    email: "student@tnpsce.academy",
    role: "STUDENT"
  }
};

export function canAccess(role: Role, area: "admin" | "student") {
  if (area === "admin") {
    return role === "SUPER_ADMIN" || role === "ADMIN";
  }
  return role === "STUDENT";
}
