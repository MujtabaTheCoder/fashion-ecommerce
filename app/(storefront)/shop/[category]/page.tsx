import { PagePlaceholder } from "@/components/layout/PagePlaceholder";

type ShopCategoryPageProps = {
  params: Promise<{ category: string }>;
};

export default async function ShopCategoryPage({
  params,
}: ShopCategoryPageProps) {
  const { category } = await params;

  return (
    <PagePlaceholder
      title={category.replaceAll("-", " ")}
      description="Category filters and product grids are not wired yet."
    />
  );
}
