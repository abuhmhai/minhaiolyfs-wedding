import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { ProductStatus, WeddingDressStyle, WeddingDressColor, AoDaiColor, Role } from '@prisma/client';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== Role.admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      description,
      price,
      categoryId,
      color,
      style,
      status,
      stockQuantity,
      images
    } = body;

    console.log("Received request data:", {
      name,
      description,
      price,
      categoryId,
      color,
      style,
      status,
      stockQuantity,
      imagesCount: images?.length || 0
    });

    if (!name || !price || !categoryId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get category to validate style and color
    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    });

    if (!category) {
      return NextResponse.json(
        { error: "Invalid category" },
        { status: 400 }
      );
    }

    // Validate style and color based on category
    let normalizedStyle: WeddingDressStyle | null = null;
    let normalizedColor: WeddingDressColor | AoDaiColor | null = null;

    if (category.slug === 'ao-cuoi') {
      const validStyles = ['DANG_XOE_BALLGOWN', 'DANG_CHU_A', 'DANG_DUOI_CA_MERMAID'];
      const styleUpper = style?.toUpperCase();
      if (style && !validStyles.includes(styleUpper)) {
        return NextResponse.json(
          { error: "Invalid style for wedding dress" },
          { status: 400 }
        );
      }
      normalizedStyle = styleUpper as WeddingDressStyle;
      
      const colorUpper = color?.toUpperCase();
      if (color && !['OFFWHITE', 'IVORY', 'NUDE'].includes(colorUpper)) {
        return NextResponse.json(
          { error: "Invalid color for wedding dress" },
          { status: 400 }
        );
      }
      normalizedColor = colorUpper as WeddingDressColor;
    } else if (category.slug === 'ao-dai-co-dau') {
      const colorUpper = color?.toUpperCase();
      if (color && !['DO', 'HONG', 'TRANG'].includes(colorUpper)) {
        return NextResponse.json(
          { error: "Invalid color for traditional dress" },
          { status: 400 }
        );
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

    const productId = parseInt(await params.id);
    if (isNaN(productId)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    try {
      // First, delete all existing images
      await prisma.productImage.deleteMany({
        where: { productId }
      });

      // Update product
      const updatedProduct = await prisma.product.update({
        where: { id: productId },
        data: {
          name,
          description,
          price,
          categoryId,
          color: normalizedColor,
          style: normalizedStyle,
          status,
          stockQuantity,
          slug,
          images: {
            create: images?.map((url: string) => ({ url })) || []
          }
        },
        include: {
          images: true,
          category: true
        }
      });

      return NextResponse.json(updatedProduct);
    } catch (error) {
      console.error("Error updating product:", error);
      return NextResponse.json(
        { error: "Failed to update product" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const productId = parseInt(params.id);

    // First delete all related records
    await prisma.$transaction([
      // Delete cart items
      prisma.cartItem.deleteMany({
        where: { productId }
      }),
      // Delete order items
      prisma.orderItem.deleteMany({
        where: { productId }
      }),
      // Delete product images
      prisma.productImage.deleteMany({
        where: { productId }
      }),
      // Delete product sizes
      prisma.productSize.deleteMany({
        where: { productId }
      }),
      // Delete product rental durations
      prisma.productRentalDuration.deleteMany({
        where: { productId }
      }),
      // Finally delete the product
      prisma.product.delete({
        where: { id: productId }
      })
    ]);

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
} 