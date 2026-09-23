import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type HeadingTag = "h1" | "h2" | "h3" | "h4";

type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  as?: HeadingTag;
};

const headingStyles: Record<HeadingTag, string> = {
  h1: "font-display text-4xl leading-tight tracking-tight md:text-6xl",
  h2: "font-display text-3xl leading-tight tracking-tight md:text-5xl",
  h3: "font-display text-2xl leading-snug md:text-3xl",
  h4: "font-sans text-sm uppercase tracking-[0.18em]",
};

export function Heading({
  as: Tag = "h2",
  className,
  ...props
}: HeadingProps) {
  return <Tag className={cn(headingStyles[Tag], className)} {...props} />;
}

type TextProps = HTMLAttributes<HTMLParagraphElement> & {
  muted?: boolean;
};

export function Text({ muted = false, className, ...props }: TextProps) {
  return (
    <p
      className={cn(
        "text-base leading-7",
        muted ? "text-muted" : "text-ink",
        className,
      )}
      {...props}
    />
  );
}
