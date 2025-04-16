import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ProductStatus } from '@prisma/client';

export async function POST(request: Request) {
  try {
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
      // Prepare image data
      let imageData = undefined;
      if (images.length > 0) {
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
        imageData = {
          create: existingImages.map((url) => ({
            url,
          })),
        };
      }

      // Create product
      const product = await prisma.product.create({
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
      console.error("Error creating product:", error);
      return NextResponse.json(
        { error: "Failed to create product" },
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