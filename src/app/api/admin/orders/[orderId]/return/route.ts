import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

export async function POST(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const orderId = parseInt(params.orderId);

    // Get the order with its items
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
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    if (order.status !== 'DELIVERED') {
      return NextResponse.json(
        { error: 'Only delivered orders can be returned' },
        { status: 400 }
      );
    }

    // Start a transaction to update order status and product quantities
    const result = await prisma.$transaction(async (tx) => {
      // Update order status to RETURNED
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: { status: 'RETURNED' }
      });

      // Update product quantities
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stockQuantity: {
              increment: item.quantity
            }
          }
        });
      }

      return updatedOrder;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error processing return:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 