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

    const orderId = parseInt(params.orderId);
    if (isNaN(orderId)) {
      return new NextResponse('Invalid Order ID', { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: {
        id: orderId
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
            email: true,
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

    const orderId = parseInt(params.orderId);
    if (isNaN(orderId)) {
      return new NextResponse('Invalid Order ID', { status: 400 });
    }

    const body = await req.json();
    const { status } = body;

    if (!status || !Object.values(OrderStatus).includes(status)) {
      return new NextResponse('Invalid status', { status: 400 });
    }

    // Start a transaction to ensure data consistency
    const result = await prisma.$transaction(async (prisma) => {
      // Get the current order with items
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      });

      if (!order) {
        throw new Error('Order not found');
      }

      // If status is changing to DELIVERED, update product quantities
      if (status === 'DELIVERED' && order.status !== 'DELIVERED') {
        // Update quantities for each item in the order
        for (const item of order.items) {
          await prisma.product.update({
            where: { id: item.productId },
            data: {
              stockQuantity: {
                decrement: item.quantity
              }
            }
          });
        }
      }

      // Update the order status
      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: { status },
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
              email: true,
              phone: true,
              address: true
            }
          }
        }
      });

      return updatedOrder;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating order:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 