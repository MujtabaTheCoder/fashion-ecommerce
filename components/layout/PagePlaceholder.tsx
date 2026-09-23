import { Container } from "@/components/ui/Container";
import { Heading, Text } from "@/components/ui/Typography";

type PagePlaceholderProps = {
  title: string;
  description: string;
};

export function PagePlaceholder({ title, description }: PagePlaceholderProps) {
  return (
    <Container as="section" className="py-20 md:py-28">
      <Heading as="h1" className="max-w-2xl">
        {title}
      </Heading>
      <Text muted className="mt-6 max-w-xl">
        {description}
      </Text>
    </Container>
  );
}
