import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';

    const products = await prisma.product.findMany({
      where: {
        AND: [
          {
            OR: [
              { name: { contains: query } },
              { description: { contains: query } },
            ],
          },
          category ? { category: { slug: category } } : {},
        ],
      },
      include: {
        images: true,
        category: true,
      },
      take: 10,
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to search products' },
      { status: 500 }
    );
  }
} 