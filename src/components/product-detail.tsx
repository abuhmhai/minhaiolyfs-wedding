import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductDetailClient from "@/components/products/ProductDetailClient";

interface ProductDetailProps {
  slug: string;
}

export default async function ProductDetail({ slug }: ProductDetailProps) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: true,
      category: true,
    },
  });

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-center">Product not found</h1>
      </div>
    );
  }

  return <ProductDetailClient product={product} />;
}
