import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ProductStatus } from '@prisma/client';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const categoryId = formData.get("categoryId");
    const color = formData.get("color") as string;
    const status = formData.get("status") as ProductStatus;
    const stockQuantity = parseInt(formData.get("stockQuantity") as string);
    const images = formData.getAll("images") as string[];

    if (!categoryId) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      );
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    // Create product
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        color,
        status,
        stockQuantity,
        slug,
        category: {
          connect: {
            id: Number(categoryId)
          }
        },
        images: {
          create: images.map(url => ({
            url: url
          }))
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 