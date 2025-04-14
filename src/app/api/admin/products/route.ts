import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const formData = await request.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const categoryId = parseInt(formData.get("categoryId") as string);
    const color = formData.get("color") as string;
    const status = formData.get("status") as "IN_STOCK" | "OUT_OF_STOCK";
    const images = formData.getAll("images") as File[];

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Create product
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        categoryId,
        color,
        status,
        slug,
        images: {
          create: await Promise.all(
            images.map(async (image) => {
              // TODO: Upload image to storage service (e.g., AWS S3, Cloudinary)
              // For now, we'll just store the file name
              return {
                url: image.name,
              };
            })
          ),
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 