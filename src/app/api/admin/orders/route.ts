import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Role } from '@prisma/client';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== Role.admin) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const orders = await prisma.order.findMany({
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
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform the orders to match the expected format
    const transformedOrders = orders.map(order => ({
      ...order,
      orderItems: order.items
    }));

    return NextResponse.json(transformedOrders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 