import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Heading, Text } from "@/components/ui/Typography";
import { buttonClassName } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <Container as="section" className="py-24">
      <Heading as="h1">Page not found</Heading>
      <Text muted className="mt-4 max-w-md">
        The page you are looking for does not exist or has been moved.
      </Text>
      <Link href="/" className={`${buttonClassName({ variant: "primary" })} mt-8`}>
        Back home
      </Link>
    </Container>
  );
}
