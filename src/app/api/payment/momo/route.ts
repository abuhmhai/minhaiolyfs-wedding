import { NextResponse } from 'next/server';
import { createPaymentRequest } from '@/lib/momo';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { orderId } = await request.json();

    // Get order details
    const order = await prisma.order.findUnique({
      where: { id: parseInt(orderId) },
      include: {
        items: true
      }
    });

    if (!order) {
      return new NextResponse('Order not found', { status: 404 });
    }

    if (order.userId !== parseInt(session.user.id)) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Create payment request
    const paymentResponse = await createPaymentRequest(
      orderId,
      order.total,
      `Thanh toán đơn hàng #${orderId}`
    );

    return NextResponse.json(paymentResponse);
  } catch (error) {
    console.error('Error processing payment:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 