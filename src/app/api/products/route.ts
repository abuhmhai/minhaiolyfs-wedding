import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/products - Public endpoint to list all products
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
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
        orderBy: { createdAt: 'desc' }
      }),
      prisma.product.count({ where })
    ]);

    return NextResponse.json({
      products,
      total,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// POST /api/products - Admin only endpoint to create a new product
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const {
      name,
      description,
      price,
      categoryId,
      color,
      size,
      images,
      isAvailable = true
    } = data;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        categoryId: parseInt(categoryId),
        color,
        size,
        isAvailable,
        slug: name.toLowerCase().replace(/\s+/g, '-'),
        images: {
          create: images.map((url: string) => ({ url }))
        }
      },
      include: {
        category: true,
        images: true
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 