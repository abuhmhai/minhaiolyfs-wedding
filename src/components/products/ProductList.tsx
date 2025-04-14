import { prisma } from "@/lib/prisma";
import ProductCard from "./ProductCard";
import Pagination from "./Pagination";

interface ProductListProps {
  search?: string;
  category?: string;
  page: number;
}

export default async function ProductList({
  search,
  category,
  page,
}: ProductListProps) {
  const limit = 12;
  const skip = (page - 1) * limit;

  const where = {
    ...(category ? { categoryId: parseInt(category) } : {}),
    ...(search ? {
      OR: [
        { name: { contains: search } },
        { description: { contains: search } }
      ]
    } : {})
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: true,
        images: true,
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" }
    }),
    prisma.product.count({ where })
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            search={search}
            category={category}
          />
        </div>
      )}
    </div>
  );
} 