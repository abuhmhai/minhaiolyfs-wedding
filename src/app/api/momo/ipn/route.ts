import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { OrderStatus } from '@prisma/client';

interface MomoIPNPayload {
  orderType: string;
  amount: number;
  partnerCode: string;
  orderId: string;
  extraData: string;
  signature: string;
  transId: number;
  responseTime: number;
  resultCode: number;
  message: string;
  payType: string;
  requestId: string;
  orderInfo: string;
}

export async function POST(request: Request) {
  try {
    const payload: MomoIPNPayload = await request.json();
    console.log('Momo IPN received:', payload);

    // Verify the signature
    const rawSignature = `amount=${payload.amount}&extraData=${payload.extraData}&message=${payload.message}&orderId=${payload.orderId}&orderInfo=${payload.orderInfo}&orderType=${payload.orderType}&partnerCode=${payload.partnerCode}&payType=${payload.payType}&requestId=${payload.requestId}&responseTime=${payload.responseTime}&resultCode=${payload.resultCode}&transId=${payload.transId}`;
    
    const signature = crypto
      .createHmac('sha256', process.env.MOMO_SECRET_KEY || '')
      .update(rawSignature)
      .digest('hex');

    if (signature !== payload.signature) {
      console.error('Invalid signature');
      return new NextResponse(null, { status: 400 });
    }

    // Find the order
    const order = await prisma.order.findUnique({
      where: { id: parseInt(payload.orderId) },
      include: { items: true }
    });

    if (!order) {
      console.error('Order not found:', payload.orderId);
      return new NextResponse(null, { status: 404 });
    }

    // Verify amount
    if (order.total !== payload.amount) {
      console.error('Amount mismatch:', order.total, payload.amount);
      return new NextResponse(null, { status: 400 });
    }

    // Update order status based on resultCode
    let status: OrderStatus = OrderStatus.PROCESSING;
    if (payload.resultCode === 0 || payload.resultCode === 9000) {
      status = OrderStatus.SHIPPED; // Using SHIPPED as successful state
    }

    // Update the order
    await prisma.order.update({
      where: { id: parseInt(payload.orderId) },
      data: {
        status,
        updatedAt: new Date()
      }
    });

    console.log('Order updated:', payload.orderId, status);

    // Return 204 No Content as required by Momo
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error processing Momo IPN:', error);
    return new NextResponse(null, { status: 500 });
  }
} 