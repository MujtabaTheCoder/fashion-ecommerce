import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function Input({
  label,
  error,
  id,
  className,
  ...props
}: InputProps) {
  const inputId = id ?? props.name;

  return (
    <label className="flex w-full flex-col gap-2" htmlFor={inputId}>
      <span className="text-xs uppercase tracking-[0.16em] text-muted">
        {label}
      </span>
      <input
        id={inputId}
        className={cn(
          "h-12 border border-border bg-surface px-4 text-sm text-ink placeholder:text-muted/70",
          error && "border-danger",
          className,
        )}
        aria-invalid={Boolean(error)}
        aria-describedby={error && inputId ? `${inputId}-error` : undefined}
        {...props}
      />
      {error ? (
        <span id={`${inputId}-error`} className="text-sm text-danger">
          {error}
        </span>
      ) : null}
    </label>
  );
}
