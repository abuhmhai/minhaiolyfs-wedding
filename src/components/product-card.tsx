import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@prisma/client';

interface ProductCardProps {
  product: Product & {
    images: { url: string }[];
    category: { name: string };
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const formattedPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(product.price);

  return (
    <Link href={`/products/${product.slug}`}>
      <div className="group relative">
        <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
          <Image
            src={product.images[0]?.url || '/placeholder.png'}
            alt={product.name}
            width={500}
            height={500}
            className="h-full w-full object-cover object-center lg:h-full lg:w-full"
            priority={false}
          />
        </div>
        <div className="mt-4 flex justify-between">
          <div>
            <h3 className="text-sm text-gray-700">
              <span aria-hidden="true" className="absolute inset-0" />
              {product.name}
            </h3>
            <p className="mt-1 text-sm text-gray-500">{product.category.name}</p>
          </div>
          <p className="text-sm font-medium text-gray-900">{formattedPrice}</p>
        </div>
      </div>
    </Link>
  );
} 