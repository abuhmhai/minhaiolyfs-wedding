import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { ProductStatus } from '@/types/supabase';

const getStatusBasedOnQuantity = (quantity: number): ProductStatus => {
  if (quantity <= 0) {
    return 'OUT_OF_STOCK';
  } else if (quantity < 10) {
    return 'LOW_STOCK';
  } else {
    return 'IN_STOCK';
  }
};

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const products = await prisma.product.findMany({
      include: {
        images: true,
        category: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { name, description, price, categoryId, images, status } = body;

    // Create product
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        status,
        categoryId,
        images: {
          create: images.map((url: string) => ({ url }))
        }
      },
      include: {
        images: true,
        category: true
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { id, name, description, price, categoryId, images, status } = body;

    // Update product
    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price,
        status,
        categoryId,
        images: {
          deleteMany: {},
          create: images.map((url: string) => ({ url }))
        }
      },
      include: {
        images: true,
        category: true
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 