import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/products - Public endpoint to list all products
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get('category');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    let where = {};

    if (categorySlug) {
      console.log('Filtering by category:', categorySlug);
      where = {
        category: {
          slug: categorySlug
        }
      };
    }

    if (search) {
      where = {
        ...where,
        OR: [
          { name: { contains: search } },
          { description: { contains: search } }
        ]
      };
    }

    console.log('Final where clause:', where);

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        select: {
          id: true,
          name: true,
          price: true,
          slug: true,
          color: true,
          style: true,
          createdAt: true,
          category: {
            select: {
              name: true,
              slug: true,
            }
          },
          images: {
            select: {
              url: true,
            }
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.product.count({ where })
    ]);

    console.log('Found products:', products.length);

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
      category: categorySlug,
      color,
      images,
    } = data;

    // Find the category by slug
    const category = await prisma.category.findUnique({
      where: { slug: categorySlug }
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        categoryId: category.id,
        color,
        status: 'IN_STOCK',
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
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