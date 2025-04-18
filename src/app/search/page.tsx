import { Suspense } from 'react';
import { ProductCard } from '@/components/product-card';
import { prisma } from '@/lib/prisma';

async function getSearchResults(query: string, category: string) {
  const products = await prisma.product.findMany({
    where: {
      AND: [
        {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { category: { name: { contains: query, mode: 'insensitive' } } },
          ],
        },
        category ? { category: { slug: category } } : {},
      ],
    },
    include: {
      images: true,
      category: true,
    },
    take: 20,
  });

  return products;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string };
}) {
  const query = searchParams.q || '';
  const category = searchParams.category || '';

  const products = await getSearchResults(query, category);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {query ? (
          <>
            Kết quả tìm kiếm cho "{query}"
            {category && ` trong danh mục ${category}`}
          </>
        ) : (
          'Tất cả sản phẩm'
        )}
      </h1>

      {products.length === 0 ? (
        <p className="text-gray-500">Không tìm thấy sản phẩm phù hợp.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
} 