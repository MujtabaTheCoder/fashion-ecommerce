import React from "react";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Typography";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { Sparkles, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Secured Checkout · ATELIER",
  description: "Complete your luxury atelier purchase with complimentary insured white-glove delivery.",
};

export default function CheckoutPage() {
  return (
    <div className="bg-background py-12 md:py-20">
      <Container as="section">
        <div className="flex flex-col items-start border-b border-border pb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            Atelier Salon Checkout
          </div>
          <Heading as="h1" className="mt-3 font-display text-3xl font-normal text-ink sm:text-4xl md:text-5xl">
            Complete Your Acquisition
          </Heading>
          <p className="mt-2 text-xs sm:text-sm text-muted">
            All pieces are insured and dispatched directly from our Italian manufacture in tamper-proof bespoke packaging.
          </p>
        </div>

        <div className="mt-10">
          <CheckoutForm />
        </div>
      </Container>
    </div>
  );
}
