import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Role, OrderStatus } from '@prisma/client';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== Role.admin) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get total count of orders
    const total = await prisma.order.count();

    // Get counts by status
    const pending = await prisma.order.count({
      where: { status: OrderStatus.PENDING }
    });

    const processing = await prisma.order.count({
      where: { status: OrderStatus.PROCESSING }
    });

    const shipped = await prisma.order.count({
      where: { status: OrderStatus.SHIPPED }
    });

    const delivered = await prisma.order.count({
      where: { status: OrderStatus.DELIVERED }
    });

    const cancelled = await prisma.order.count({
      where: { status: OrderStatus.CANCELLED }
    });

    // Get recent orders
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc'
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
      }
    });

    return NextResponse.json({
      total,
      pending,
      processing,
      shipped,
      delivered,
      cancelled,
      recentOrders
    });
  } catch (error) {
    console.error('Error fetching order statistics:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 