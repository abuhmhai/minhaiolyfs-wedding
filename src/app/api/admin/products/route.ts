import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { ProductStatus, Role, WeddingDressStyle, WeddingDressColor, AoDaiColor } from '@prisma/client';

const getStatusBasedOnQuantity = (quantity: number): ProductStatus => {
  if (quantity <= 0) {
    return ProductStatus.OUT_OF_STOCK;
  } else if (quantity < 10) {
    return ProductStatus.LOW_STOCK;
  } else {
    return ProductStatus.IN_STOCK;
  }
};

const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== Role.admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const products = await prisma.product.findMany({
      include: {
        category: {
          select: {
            name: true,
          },
        },
        images: {
          select: {
            url: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== Role.admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { 
      name, 
      description, 
      price, 
      categoryId, 
      images, 
      status,
      stockQuantity,
      style,
      color
    } = body;

    console.log("Received request data:", {
      name,
      description,
      price,
      categoryId,
      imagesCount: images?.length || 0,
      status,
      stockQuantity,
      style,
      color
    });

    if (!name || !price || !categoryId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get category to validate style and color
    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    });

    if (!category) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }

    // Validate style and color based on category
    let normalizedStyle: WeddingDressStyle | null = null;
    let normalizedColor: WeddingDressColor | AoDaiColor | null = null;

    if (category.slug === 'ao-cuoi') {
      const validStyles = ['DANG_XOE_BALLGOWN', 'DANG_CHU_A', 'DANG_DUOI_CA_MERMAID'];
      const styleUpper = style?.toUpperCase().replace(/-/g, '_');
      if (style && !validStyles.includes(styleUpper)) {
        return NextResponse.json({ error: 'Invalid style for wedding dress' }, { status: 400 });
      }
      normalizedStyle = styleUpper as WeddingDressStyle;
      
      const colorUpper = color?.toUpperCase();
      if (color && !['OFFWHITE', 'IVORY', 'NUDE'].includes(colorUpper)) {
        return NextResponse.json({ error: 'Invalid color for wedding dress' }, { status: 400 });
      }
      normalizedColor = colorUpper as WeddingDressColor;
    } else if (category.slug === 'ao-dai-co-dau') {
      const colorUpper = color?.toUpperCase();
      if (color && !['DO', 'HONG', 'TRANG'].includes(colorUpper)) {
        return NextResponse.json({ error: 'Invalid color for traditional dress' }, { status: 400 });
      }
      normalizedColor = colorUpper as AoDaiColor;
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Create product
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price: parseFloat(price),
        status: status || getStatusBasedOnQuantity(stockQuantity || 0),
        stockQuantity: parseInt(stockQuantity) || 0,
        categoryId: parseInt(categoryId),
        style: normalizedStyle,
        color: normalizedColor,
        images: {
          create: images?.map((url: string) => ({ url })) || []
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
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== Role.admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { 
      id, 
      name, 
      description, 
      price, 
      categoryId, 
      images, 
      status,
      stockQuantity,
      style,
      color
    } = body;

    if (!id || !name || !price || !categoryId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate style if provided
    if (style && !Object.values(WeddingDressStyle).includes(style)) {
      return NextResponse.json({ error: 'Invalid style value' }, { status: 400 });
    }

    // Update product
    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name,
        slug: generateSlug(name),
        description,
        price: parseFloat(price),
        status: status || getStatusBasedOnQuantity(stockQuantity || 0),
        stockQuantity: parseInt(stockQuantity) || 0,
        categoryId: parseInt(categoryId),
        style: style as WeddingDressStyle,
        color,
        images: {
          deleteMany: {},
          create: images?.map((url: string) => ({ url })) || []
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
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 