import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductBySlug } from "@/lib/data/products";
import { ProductDetailView } from "@/components/product/ProductDetailView";
import { MOCK_PRODUCTS } from "@/lib/data/mockProducts";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return MOCK_PRODUCTS.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Creation Not Found · ATELIER",
    };
  }

  return {
    title: `${product.name} · ATELIER`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailView product={product} />;
}
