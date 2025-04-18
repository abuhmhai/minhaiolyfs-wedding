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
      category: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
  });

  if (!product || !product.images || product.images.length === 0) {
    notFound();
  }

  // Transform the product to match the expected type
  const transformedProduct = {
    ...product,
    images: product.images.map(img => ({ url: img.url })),
    category: {
      name: product.category.name,
      slug: product.category.slug,
    },
  };

  return <ProductDetailClient product={transformedProduct} />;
}
