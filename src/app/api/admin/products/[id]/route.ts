import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
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

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    try {
      // First, delete existing images if we're not keeping them
      if (images.length > 0 || existingImages.length === 0) {
        console.log("Deleting existing images");
        await prisma.productImage.deleteMany({
          where: { productId: parseInt(params.id) }
        });
      }

      // Prepare image data
      let imageData = undefined;
      if (images.length > 0) {
        console.log("Processing new images");
        imageData = {
          create: await Promise.all(
            images.map(async (image) => {
              return {
                url: image.name,
              };
            })
          ),
        };
      } else if (existingImages.length > 0) {
        console.log("Keeping existing images");
        imageData = {
          create: existingImages.map((url) => ({
            url,
          })),
        };
      }

      // Update product
      const product = await prisma.product.update({
        where: { id: parseInt(params.id) },
        data: {
          name,
          description,
          price,
          categoryId,
          color,
          status,
          stockQuantity,
          slug,
          images: imageData,
        },
      });

      return NextResponse.json(product);
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
    await prisma.product.delete({
      where: { id: parseInt(params.id) },
    });

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 