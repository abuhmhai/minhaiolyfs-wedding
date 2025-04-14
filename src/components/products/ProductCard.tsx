import Image from "next/image";
import Link from "next/link";
import { Product } from "@prisma/client";

interface ProductCardProps {
  product: Product & {
    category: { name: string };
    images: { url: string }[];
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-square">
          <Image
            src={product.images[0]?.url || "/placeholder.jpg"}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
          <p className="text-gray-600 text-sm mb-2">{product.category.name}</p>
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold">${product.price}</span>
            {!product.isAvailable && (
              <span className="text-sm text-red-500">Out of Stock</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
} 