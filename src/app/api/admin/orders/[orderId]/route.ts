import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Role, OrderStatus } from '@prisma/client';

export async function GET(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== Role.admin) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const order = await prisma.order.findUnique({
      where: {
        id: parseInt(params.orderId)
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

    // Transform the order to match the expected format
    const transformedOrder = {
      ...order,
      orderItems: order.items,
      fullName: order.user.fullName,
      phone: order.user.phone || '',
      address: order.user.address || '',
      note: null,
      total: order.total
    };

    return NextResponse.json(transformedOrder);
  } catch (error) {
    console.error('Error fetching order:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== Role.admin) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { status } = await request.json();

    if (!status || !Object.values(OrderStatus).includes(status)) {
      return new NextResponse('Invalid status', { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: {
        id: parseInt(params.orderId)
      }
    });

    if (!order) {
      return new NextResponse('Order not found', { status: 404 });
    }

    // Validate status transition
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.PENDING]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
      [OrderStatus.PROCESSING]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
      [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED, OrderStatus.CANCELLED],
      [OrderStatus.DELIVERED]: [],
      [OrderStatus.CANCELLED]: []
    };

    if (!validTransitions[order.status].includes(status)) {
      return new NextResponse('Invalid status transition', { status: 400 });
    }

    const updatedOrder = await prisma.order.update({
      where: {
        id: parseInt(params.orderId)
      },
      data: {
        status
      }
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 