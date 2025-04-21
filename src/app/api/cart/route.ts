import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ items: [] }, { status: 200 });
    }

    const cart = await prisma.cart.findUnique({
      where: {
        userId: parseInt(session.user.id)
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json({ items: cart?.items || [] }, { status: 200 });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Please login to add items to cart" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      productId,
      quantity,
      size,
      color,
      style,
      rentalStartDate,
      rentalEndDate,
      rentalDurationId
    } = body;

    // Get or create user's cart
    let cart = await prisma.cart.findUnique({
      where: {
        userId: parseInt(session.user.id)
      }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: parseInt(session.user.id)
        }
      });
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { images: true }
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: productId,
        size: size || null,
        color: color || null,
        style: style || null,
        rentalStartDate: rentalStartDate || null,
        rentalEndDate: rentalEndDate || null,
        rentalDurationId: rentalDurationId || null
      }
    });

    if (existingItem) {
      // Update quantity if item exists
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity
        },
        include: {
          product: {
            include: {
              images: true
            }
          }
        }
      });

      return NextResponse.json(updatedItem, { status: 200 });
    }

    // Create new cart item
    const newItem = await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
        size: size || null,
        color: color || null,
        style: style || null,
        rentalStartDate: rentalStartDate ? new Date(rentalStartDate) : null,
        rentalEndDate: rentalEndDate ? new Date(rentalEndDate) : null,
        rentalDurationId: rentalDurationId || null
      },
      include: {
        product: {
          include: {
            images: true
          }
        }
      }
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { error: "Failed to add item to cart" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Please login to remove items from cart" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('itemId');

    if (!itemId) {
      return NextResponse.json(
        { error: "Item ID is required" },
        { status: 400 }
      );
    }

    const cart = await prisma.cart.findUnique({
      where: {
        userId: parseInt(session.user.id)
      }
    });

    if (!cart) {
      return NextResponse.json(
        { error: "Cart not found" },
        { status: 404 }
      );
    }

    await prisma.cartItem.delete({
      where: {
        id: parseInt(itemId),
        cartId: cart.id
      }
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error removing from cart:", error);
    return NextResponse.json(
      { error: "Failed to remove item from cart" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Please login to update cart" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { itemId, quantity } = body;

    if (!itemId || !quantity) {
      return NextResponse.json(
        { error: "Item ID and quantity are required" },
        { status: 400 }
      );
    }

    const cart = await prisma.cart.findUnique({
      where: {
        userId: parseInt(session.user.id)
      }
    });

    if (!cart) {
      return NextResponse.json(
        { error: "Cart not found" },
        { status: 404 }
      );
    }

    const updatedItem = await prisma.cartItem.update({
      where: {
        id: parseInt(itemId),
        cartId: cart.id
      },
      data: {
        quantity
      },
      include: {
        product: {
          include: {
            images: true
          }
        }
      }
    });

    return NextResponse.json(updatedItem, { status: 200 });
  } catch (error) {
    console.error("Error updating cart:", error);
    return NextResponse.json(
      { error: "Failed to update cart" },
      { status: 500 }
    );
  }
} 