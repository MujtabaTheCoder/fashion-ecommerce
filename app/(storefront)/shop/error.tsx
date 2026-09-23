"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Heading, Text } from "@/components/ui/Typography";

export default function ShopError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container as="section" className="py-24">
      <Heading as="h1">Unable to load the shop</Heading>
      <Text muted className="mt-4 max-w-md">
        We could not fetch products from the catalog. Check your Supabase
        connection and try again.
      </Text>
      <Button className="mt-8" onClick={() => reset()}>
        Try again
      </Button>
    </Container>
  );
}
