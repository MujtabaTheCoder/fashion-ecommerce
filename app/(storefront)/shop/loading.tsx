import { Container } from "@/components/ui/Container";

export default function ShopLoading() {
  return (
    <Container as="section" className="py-16 md:py-24" aria-busy="true">
      <div className="h-12 w-40 bg-border" />
      <div className="mt-4 h-4 w-full max-w-md bg-border" />
      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="aspect-[4/5] bg-border" />
        ))}
      </div>
      <span className="sr-only">Loading products</span>
    </Container>
  );
}
