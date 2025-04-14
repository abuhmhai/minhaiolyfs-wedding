import { Metadata } from 'next';
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/products/AddToCartButton";
import ProductDetail from '@/components/product-detail';

type Props = {
  params: { slug: string };
};

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { slug } = await params;
  return {
    title: `Product ${slug}`,
  };
};

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  return <ProductDetail slug={slug} />;
}
