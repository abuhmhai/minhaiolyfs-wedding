import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { OrderStatus, Role } from '@prisma/client';

export async function GET(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== Role.admin) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const orderId = params.orderId;
    if (!orderId) {
      return new NextResponse('Order ID is required', { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: {
        id: parseInt(orderId)
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
        },
        user: {
          select: {
            fullName: true,
            phone: true,
            address: true
          }
        }
      }
    });

    if (!order) {
      return new NextResponse('Order not found', { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== Role.admin) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const orderId = params.orderId;
    if (!orderId) {
      return new NextResponse('Order ID is required', { status: 400 });
    }

    const body = await req.json();
    const { status } = body;

    if (!status || !Object.values(OrderStatus).includes(status)) {
      return new NextResponse('Invalid status', { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: {
        id: parseInt(orderId)
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!order) {
      return new NextResponse('Order not found', { status: 404 });
    }

    const updatedOrder = await prisma.order.update({
      where: {
        id: parseInt(orderId)
      },
      data: {
        status
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
        },
        user: {
          select: {
            fullName: true,
            phone: true,
            address: true
          }
        }
      }
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 