import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const orderId = parseInt(await params.orderId);
    if (isNaN(orderId)) {
      return new NextResponse('Invalid Order ID', { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
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
        user: true
      }
    });

    if (!order) {
      return new NextResponse('Order not found', { status: 404 });
    }

    // Check if the user is authorized to view this order
    if (session.user.role !== 'admin' && order.userId !== parseInt(session.user.id)) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 