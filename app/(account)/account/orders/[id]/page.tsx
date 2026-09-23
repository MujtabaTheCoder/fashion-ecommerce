import { PagePlaceholder } from "@/components/layout/PagePlaceholder";

type OrderDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AccountOrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const { id } = await params;

  return (
    <PagePlaceholder
      title="Order"
      description={`Detail view for order ${id} is not implemented yet.`}
    />
  );
}
