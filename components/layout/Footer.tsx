import Link from "next/link";
import { BRAND_NAME, BRAND_TAGLINE, FOOTER_COLUMNS } from "@/lib/constants";
import { Container } from "@/components/ui/Container";
import { Text } from "@/components/ui/Typography";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <Container className="grid gap-12 py-16 md:grid-cols-4 md:py-20">
        <div className="md:col-span-1">
          <p className="font-display text-2xl tracking-[0.18em]">{BRAND_NAME}</p>
          <Text muted className="mt-4 max-w-xs text-sm">
            {BRAND_TAGLINE}
          </Text>
        </div>
        {FOOTER_COLUMNS.map((column) => (
          <div key={column.title}>
            <p className="text-xs uppercase tracking-[0.18em] text-muted">
              {column.title}
            </p>
            <ul className="mt-4 space-y-3">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-ink/80 transition-colors hover:text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>
      <Container className="flex flex-col gap-2 border-t border-border py-6 text-xs uppercase tracking-[0.14em] text-muted md:flex-row md:justify-between">
        <p>© {new Date().getFullYear()} {BRAND_NAME}</p>
        <p>Designed for everyday wear</p>
      </Container>
    </footer>
  );
}
