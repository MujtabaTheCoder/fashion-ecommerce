import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn("border border-border bg-surface p-6 md:p-8", className)}
      {...props}
    />
  );
}
