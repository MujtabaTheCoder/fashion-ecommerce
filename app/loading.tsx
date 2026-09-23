import { Container } from "@/components/ui/Container";

export default function Loading() {
  return (
    <Container as="section" className="py-24" aria-busy="true">
      <div className="h-10 w-48 bg-border" />
      <div className="mt-6 h-4 w-full max-w-md bg-border" />
      <span className="sr-only">Loading</span>
    </Container>
  );
}
