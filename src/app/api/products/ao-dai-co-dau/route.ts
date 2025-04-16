import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Fetching ao-dai-co-dau category...');
    const category = await prisma.category.findUnique({
      where: { slug: 'ao-dai-co-dau' },
    });

    console.log('Category found:', category);

    if (!category) {
      console.log('Category not found');
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    console.log('Fetching products for category ID:', category.id);
    const products = await prisma.product.findMany({
      where: {
        categoryId: category.id,
      },
      include: {
        images: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log('Products found:', products.length);
    console.log('First product:', products[0]);

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching ao-dai products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
} 