import { prisma } from "@/lib/db";

export async function getProducts({
  search,
  category,
  page = 1,
  limit = 12,
}: {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}) {
  const skip = (page - 1) * limit;
  const where = {
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ],
    }),
    ...(category && {
      OR: category === 'ao-cuoi' 
        ? [
            { category: { slug: 'ball-gown' } },
            { category: { slug: 'a-line' } },
            { category: { slug: 'mermaid' } }
          ]
        : [{ category: { slug: category } }]
    }),
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        images: true,
        category: true,
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    totalPages: Math.ceil(total / limit),
  };
} 