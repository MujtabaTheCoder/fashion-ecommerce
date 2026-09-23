import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-on-accent hover:bg-accent-hover border border-transparent",
  secondary:
    "bg-transparent text-ink border border-ink hover:bg-ink hover:text-on-accent",
  ghost: "bg-transparent text-ink hover:bg-border/60 border border-transparent",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-xs tracking-[0.14em]",
  md: "h-11 px-6 text-xs tracking-[0.16em]",
  lg: "h-12 px-8 text-sm tracking-[0.18em]",
};

export function buttonClassName({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: Variant;
  size?: Size;
  className?: string;
}) {
  return cn(
    "inline-flex items-center justify-center uppercase transition-colors duration-200 disabled:pointer-events-none disabled:opacity-40",
    variants[variant],
    sizes[size],
    className,
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClassName({ variant, size, className })}
      {...props}
    />
  );
}
