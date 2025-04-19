import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const orderId = params?.orderId;
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
            },
            rentalDuration: true
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

    if (order.userId !== parseInt(session.user.id)) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Transform the order to include user information
    const transformedOrder = {
      ...order,
      fullName: order.user.fullName,
      phone: order.user.phone || '',
      address: order.user.address || ''
    };

    return NextResponse.json(transformedOrder);
  } catch (error) {
    console.error('Error fetching order:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 