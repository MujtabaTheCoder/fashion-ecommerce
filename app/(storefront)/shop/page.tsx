import React, { Suspense } from "react";
import { Container } from "@/components/ui/Container";
import { Heading, Text } from "@/components/ui/Typography";
import { ShopCatalog } from "@/components/shop/ShopCatalog";
import { Sparkles, Box } from "lucide-react";

export const metadata = {
  title: "Haute Couture Collection · ATELIER",
  description: "Explore the complete curated collection of 3D visualized fashion, jewelry, and tailoring.",
};

export default function ShopPage() {
  return (
    <div className="bg-background py-12 md:py-20">
      <Container as="section">
        {/* Header Title */}
        <div className="flex flex-col items-start border-b border-border pb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
            <Sparkles className="h-3 w-3 text-amber-500" />
            Permanent Collection 2026
          </div>
          <Heading as="h1" className="mt-4 font-display text-4xl font-normal tracking-tight sm:text-5xl md:text-6xl">
            The Complete Atelier Collection
          </Heading>
          <Text muted className="mt-3 max-w-2xl text-sm leading-relaxed">
            Every garment and fine accessory in our salon is crafted in limited numbers, with full interactive 3D WebGL inspection and white-glove global delivery.
          </Text>
        </div>

        {/* Catalog Body */}
        <div className="mt-10">
          <Suspense
            fallback={
              <div className="py-20 text-center text-sm text-muted">
                Loading fine collection...
              </div>
            }
          >
            <ShopCatalog />
          </Suspense>
        </div>
      </Container>
    </div>
  );
}
