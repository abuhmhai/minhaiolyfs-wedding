import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const products = await prisma.product.findMany({
      where: {
        category: {
          slug: params.slug
        }
      },
      include: {
        category: true,
        images: true,
        sizes: true,
        rentalDurations: true,
      },
    });

    if (!products || products.length === 0) {
      return NextResponse.json(
        { error: 'No products found in this category' },
        { status: 404 }
      );
    }

    // Transform the data to match the frontend interface
    const transformedProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      images: product.images.map(img => img.url),
      slug: product.slug,
      color: product.color,
      status: product.status,
      category: {
        name: product.category.name,
      },
      sizes: product.sizes.map(size => size.name),
      rentalDurations: product.rentalDurations.map(duration => ({
        id: duration.id,
        duration: duration.name,
        price: duration.price,
      })),
    }));

    return NextResponse.json(transformedProducts);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 