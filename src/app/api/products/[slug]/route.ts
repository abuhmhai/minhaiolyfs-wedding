import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: params.slug },
      include: {
        category: true,
        images: true,
        sizes: true,
        rentalDurations: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Transform the data to match the frontend interface
    const transformedProduct = {
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
    };

    return NextResponse.json(transformedProduct);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 