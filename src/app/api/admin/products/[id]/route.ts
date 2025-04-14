import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("Processing product update for ID:", params.id);

    const formData = await request.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const categoryId = parseInt(formData.get("categoryId") as string);
    const color = formData.get("color") as string;
    const status = formData.get("status") as "IN_STOCK" | "OUT_OF_STOCK";
    const images = formData.getAll("images") as File[];
    const existingImages = formData.getAll("existingImages") as string[];

    console.log("Received form data:", {
      name,
      description,
      price,
      categoryId,
      color,
      status,
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
          slug,
          images: imageData,
        },
        include: {
          category: true,
          images: true,
        },
      });

      console.log("Product updated successfully:", product);

      return NextResponse.json(product);
    } catch (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Database error occurred" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Delete product
    await prisma.product.delete({
      where: { id: parseInt(params.id) },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 