import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(value: string | Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}

export function formatTime(value: string | Date) {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

export function percent(value: number) {
  return `${Math.round(value)}%`;
}

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function statusTone(status: string) {
  const normalized = status.toLowerCase();
  if (["active", "published", "passed", "submitted", "success"].includes(normalized)) {
    return "success";
  }
  if (["draft", "upcoming", "review"].includes(normalized)) {
    return "warning";
  }
  if (["closed", "failed", "danger", "error"].includes(normalized)) {
    return "danger";
  }
  return "neutral";
}
