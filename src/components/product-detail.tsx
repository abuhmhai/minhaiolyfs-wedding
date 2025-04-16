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

  if (!product || !product.images || product.images.length === 0) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
