import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { ProductStatus } from '@prisma/client';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log("Processing product update for ID:", params.id);

    const formData = await request.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const categoryId = parseInt(formData.get("categoryId") as string);
    const color = formData.get("color") as string;
    const style = formData.get("style") as string;
    const status = formData.get("status") as ProductStatus;
    const stockQuantity = parseInt(formData.get("stockQuantity") as string);
    const images = formData.getAll("images") as File[];
    const existingImages = formData.getAll("existingImages") as string[];

    console.log("Received form data:", {
      name,
      description,
      price,
      categoryId,
      color,
      style,
      status,
      stockQuantity,
      imagesCount: images.length,
      existingImagesCount: existingImages.length
    });

    if (!name || !price || !categoryId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate style and color based on category
    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    });

    if (!category) {
      return NextResponse.json(
        { error: "Invalid category" },
        { status: 400 }
      );
    }

    if (category.slug === 'ao-cuoi') {
      if (!style || !['dang-xoe-ballgown', 'dang-chu-a', 'dang-duoi-ca-mermaid'].includes(style)) {
        return NextResponse.json(
          { error: "Invalid style for wedding dress" },
          { status: 400 }
        );
      }
      if (!color || !['offwhite', 'ivory', 'nude'].includes(color)) {
        return NextResponse.json(
          { error: "Invalid color for wedding dress" },
          { status: 400 }
        );
      }
    } else if (category.slug === 'ao-dai-co-dau') {
      if (!color || !['do', 'hong', 'trang'].includes(color)) {
        return NextResponse.json(
          { error: "Invalid color for traditional dress" },
          { status: 400 }
        );
      }
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    try {
      // First, delete all existing images
      await prisma.productImage.deleteMany({
        where: { productId: parseInt(params.id) }
      });

      // Prepare image data
      let imageData = undefined;
      if (existingImages.length > 0) {
        console.log("Setting existing images");
        imageData = {
          create: existingImages.map((url) => ({
            url,
          })),
        };
      }

      // Update product
      const updatedProduct = await prisma.product.update({
        where: { id: parseInt(params.id) },
        data: {
          name,
          description,
          price,
          categoryId,
          color,
          style,
          status,
          stockQuantity,
          slug,
          images: imageData,
        },
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