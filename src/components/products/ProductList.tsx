"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@prisma/client";

interface ProductListProps {
  products: (Product & {
    images: { url: string }[];
    category: { name: string };
  })[];
}

export default function ProductList({ products }: ProductListProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600">No products found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Link
          key={product.id}
          href={`/products/${product.slug}`}
          className="group"
        >
          <div className="relative aspect-square overflow-hidden rounded-lg">
            <Image
              src={product.images[0]?.url || "/placeholder.jpg"}
              alt={product.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-sm text-gray-500">{product.category.name}</p>
            <p className="mt-2 font-medium">${product.price.toFixed(2)}</p>
          </div>
        </Link>
      ))}
    </div>
  );
} 