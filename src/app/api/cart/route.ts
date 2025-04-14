import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    return NextResponse.json(cart, { status: 200 });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { productId, quantity } = await request.json();

    // Find or create cart
    let cart = await prisma.cart.findUnique({
      where: { userId: session.user.id }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: session.user.id
        }
      });
    }

    // Add or update cart item
    const cartItem = await prisma.cartItem.upsert({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId
        }
      },
      update: {
        quantity
      },
      create: {
        cartId: cart.id,
        productId,
        quantity
      }
    });

    return NextResponse.json(cartItem, { status: 200 });
  } catch (error) {
    console.error("Error updating cart:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id }
    });

    if (!cart) {
      return NextResponse.json(
        { error: "Cart not found" },
        { status: 404 }
      );
    }

    await prisma.cartItem.delete({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId
        }
      }
    });

    return NextResponse.json(
      { message: "Item removed from cart" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error removing item from cart:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 