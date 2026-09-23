import { PagePlaceholder } from "@/components/layout/PagePlaceholder";

type AdminProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminProductPage({
  params,
}: AdminProductPageProps) {
  const { id } = await params;

  return (
    <PagePlaceholder
      title="Edit product"
      description={`Editor for product ${id} is not implemented yet.`}
    />
  );
}
