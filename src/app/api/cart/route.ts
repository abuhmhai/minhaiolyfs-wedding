import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ items: [] }, { status: 200 });
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: parseInt(session.user.id) },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                stockQuantity: true,
                images: true
              }
            }
          }
        }
      }
    });

    if (!cart) {
      return NextResponse.json({ items: [] }, { status: 200 });
    }

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
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Please login to add items to cart" },
        { status: 401 }
      );
    }

    const { 
      productId, 
      quantity, 
      color, 
      type, 
      style, 
      rentalStartDate, 
      rentalEndDate 
    } = await request.json();

    // Find or create cart
    let cart = await prisma.cart.findUnique({
      where: { userId: parseInt(session.user.id) }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: parseInt(session.user.id)
        }
      });
    }

    // Get the product to check if it's a wedding dress
    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) },
      include: { category: true }
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const isWeddingDress = product.category.slug === 'ao-cuoi';

    // Add or update cart item
    const cartItem = await prisma.cartItem.upsert({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: parseInt(productId)
        }
      },
      update: {
        quantity,
        color,
        type,
        style,
        rentalStartDate: isWeddingDress ? new Date(rentalStartDate) : null,
        rentalEndDate: isWeddingDress ? new Date(rentalEndDate) : null
      },
      create: {
        cartId: cart.id,
        productId: parseInt(productId),
        quantity,
        color,
        type,
        style,
        rentalStartDate: isWeddingDress ? new Date(rentalStartDate) : null,
        rentalEndDate: isWeddingDress ? new Date(rentalEndDate) : null
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            images: true,
            stockQuantity: true
          }
        }
      }
    });

    return NextResponse.json(cartItem, { status: 200 });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
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
      where: { userId: parseInt(session.user.id) }
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
          productId: parseInt(productId)
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

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { productId, quantity } = await request.json();

    if (!productId || !quantity) {
      return NextResponse.json(
        { error: "Product ID and quantity are required" },
        { status: 400 }
      );
    }

    // Get the cart
    const cart = await prisma.cart.findUnique({
      where: { userId: parseInt(session.user.id) }
    });

    if (!cart) {
      return NextResponse.json(
        { error: "Cart not found" },
        { status: 404 }
      );
    }

    // Get the product to check stock
    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) }
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Check if quantity exceeds stock
    if (quantity > product.stockQuantity) {
      return NextResponse.json(
        { error: "Quantity exceeds available stock" },
        { status: 400 }
      );
    }

    // Update cart item quantity
    const updatedCartItem = await prisma.cartItem.update({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: parseInt(productId)
        }
      },
      data: {
        quantity: parseInt(quantity)
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            stockQuantity: true,
            images: true
          }
        }
      }
    });

    return NextResponse.json(updatedCartItem, { status: 200 });
  } catch (error) {
    console.error("Error updating cart item:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 