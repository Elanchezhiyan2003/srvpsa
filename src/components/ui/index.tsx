import * as React from "react";
import { AlertCircle, CheckCircle2, ChevronDown, Loader2, Search, X } from "lucide-react";
import { cn, statusTone } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "success";
type ButtonSize = "sm" | "md" | "lg" | "icon";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  isLoading,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const variants: Record<ButtonVariant, string> = {
    primary: "bg-primary text-primary-foreground hover:bg-blue-700",
    secondary: "bg-secondary text-secondary-foreground hover:bg-orange-600",
    outline: "border border-neutral-200 bg-white text-neutral-700 hover:border-primary/40 hover:text-primary",
    ghost: "bg-transparent text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
    danger: "bg-danger text-white hover:bg-red-600",
    success: "bg-success text-white hover:bg-emerald-600"
  };
  const sizes: Record<ButtonSize, string> = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-5 text-base",
    icon: "h-10 w-10 p-0"
  };

  return (
    <button
      className={cn(
        "focus-ring inline-flex shrink-0 items-center justify-center gap-2 rounded-button font-semibold shadow-sm transition disabled:pointer-events-none disabled:opacity-55",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      {children}
    </button>
  );
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => (
    <label className="block space-y-2">
      {label ? <span className="text-sm font-semibold text-neutral-700">{label}</span> : null}
      <input
        ref={ref}
        className={cn(
          "focus-ring h-11 w-full rounded-input border border-neutral-200 bg-white px-3 text-sm text-neutral-900 shadow-sm placeholder:text-neutral-400",
          error && "border-danger",
          className
        )}
        {...props}
      />
      {error ? <span className="text-xs font-medium text-danger">{error}</span> : null}
    </label>
  )
);
Input.displayName = "Input";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, ...props }, ref) => (
    <label className="block space-y-2">
      {label ? <span className="text-sm font-semibold text-neutral-700">{label}</span> : null}
      <textarea
        ref={ref}
        className={cn(
          "focus-ring min-h-28 w-full rounded-input border border-neutral-200 bg-white px-3 py-3 text-sm text-neutral-900 shadow-sm placeholder:text-neutral-400",
          error && "border-danger",
          className
        )}
        {...props}
      />
      {error ? <span className="text-xs font-medium text-danger">{error}</span> : null}
    </label>
  )
);
Textarea.displayName = "Textarea";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { label: string; value: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, ...props }, ref) => (
    <label className="block space-y-2">
      {label ? <span className="text-sm font-semibold text-neutral-700">{label}</span> : null}
      <span className="relative block">
        <select
          ref={ref}
          className={cn(
            "focus-ring h-11 w-full appearance-none rounded-input border border-neutral-200 bg-white px-3 pr-9 text-sm text-neutral-900 shadow-sm",
            error && "border-danger",
            className
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-neutral-400" />
      </span>
      {error ? <span className="text-xs font-medium text-danger">{error}</span> : null}
    </label>
  )
);
Select.displayName = "Select";

export function SearchBar({
  placeholder = "Search",
  className
}: {
  placeholder?: string;
  className?: string;
}) {
  return (
    <label className={cn("relative block", className)}>
      <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
      <input
        placeholder={placeholder}
        className="focus-ring h-10 w-full rounded-input border border-neutral-200 bg-white pl-9 pr-3 text-sm shadow-sm"
      />
    </label>
  );
}

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <section
      className={cn("rounded-card border border-neutral-200 bg-white shadow-soft", className)}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("border-b border-neutral-100 p-5", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn("text-base font-bold text-neutral-900", className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5", className)} {...props} />;
}

export function Badge({
  children,
  tone,
  className
}: {
  children: React.ReactNode;
  tone?: "success" | "warning" | "danger" | "neutral" | "primary";
  className?: string;
}) {
  const normalizedTone = tone ?? (typeof children === "string" ? statusTone(children) : "neutral");
  const tones = {
    success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    warning: "bg-amber-50 text-amber-700 ring-amber-200",
    danger: "bg-red-50 text-red-700 ring-red-200",
    neutral: "bg-slate-100 text-slate-700 ring-slate-200",
    primary: "bg-blue-50 text-blue-700 ring-blue-200"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ring-1",
        tones[normalizedTone],
        className
      )}
    >
      {children}
    </span>
  );
}

export function Tabs({
  tabs,
  active
}: {
  tabs: string[];
  active: string;
}) {
  return (
    <div className="flex flex-wrap gap-2 rounded-card border border-neutral-200 bg-white p-1 shadow-sm">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={cn(
            "focus-ring rounded-button px-4 py-2 text-sm font-bold text-neutral-500 transition",
            tab === active && "bg-primary text-white shadow-sm"
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

export function Modal({
  title,
  children,
  open = false
}: {
  title: string;
  children: React.ReactNode;
  open?: boolean;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4">
      <div className="w-full max-w-lg rounded-card bg-white shadow-lift">
        <div className="flex items-center justify-between border-b border-neutral-100 p-5">
          <h2 className="text-lg font-bold text-neutral-900">{title}</h2>
          <Button size="icon" variant="ghost" aria-label="Close modal">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export function Drawer({
  title,
  children,
  open = false
}: {
  title: string;
  children: React.ReactNode;
  open?: boolean;
}) {
  if (!open) return null;

  return (
    <aside className="fixed inset-y-0 right-0 z-40 w-full max-w-md border-l border-neutral-200 bg-white p-5 shadow-lift">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-bold text-neutral-900">{title}</h2>
        <Button size="icon" variant="ghost" aria-label="Close drawer">
          <X className="h-4 w-4" />
        </Button>
      </div>
      {children}
    </aside>
  );
}

export function Toast({
  tone = "success",
  message
}: {
  tone?: "success" | "danger";
  message: string;
}) {
  const Icon = tone === "success" ? CheckCircle2 : AlertCircle;
  return (
    <div className="flex items-center gap-3 rounded-card border border-neutral-200 bg-white p-4 shadow-lift">
      <Icon className={cn("h-5 w-5", tone === "success" ? "text-success" : "text-danger")} />
      <p className="text-sm font-semibold text-neutral-700">{message}</p>
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-card bg-neutral-200", className)} />;
}

export function EmptyState({
  title,
  description,
  action
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-card border border-dashed border-neutral-300 bg-white p-8 text-center">
      <p className="text-base font-bold text-neutral-900">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-neutral-500">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-3 rounded-card border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
      <AlertCircle className="h-5 w-5" />
      {message}
    </div>
  );
}

export function ConfirmationDialog({
  title,
  description
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-card border border-neutral-200 bg-white p-5 shadow-soft">
      <p className="font-bold text-neutral-900">{title}</p>
      <p className="mt-2 text-sm text-neutral-500">{description}</p>
      <div className="mt-5 flex flex-wrap justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button variant="danger">Confirm</Button>
      </div>
    </div>
  );
}
