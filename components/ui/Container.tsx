import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ContainerProps = HTMLAttributes<HTMLElement> & {
  as?: "div" | "section" | "main" | "header" | "footer";
};

export function Container({
  as: Component = "div",
  className,
  ...props
}: ContainerProps) {
  return (
    <Component
      className={cn("mx-auto w-full max-w-6xl px-6 md:px-8", className)}
      {...props}
    />
  );
}
