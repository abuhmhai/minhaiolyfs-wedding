import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { items, total, fullName, phone, address, note } = body;

    // Get user information
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(session.user.id)
      }
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: parseInt(session.user.id),
        total,
        status: 'PENDING',
        fullName: fullName || user.fullName,
        phone: phone || user.phone || '',
        address: address || user.address || '',
        note: note || '',
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    // Clear user's cart
    const userCart = await prisma.cart.findUnique({
      where: {
        userId: parseInt(session.user.id)
      }
    });

    if (userCart) {
      await prisma.cartItem.deleteMany({
        where: {
          cartId: userCart.id
        }
      });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const orders = await prisma.order.findMany({
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 