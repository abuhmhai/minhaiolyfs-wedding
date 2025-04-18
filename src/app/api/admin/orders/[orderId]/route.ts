import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Role, OrderStatus, ProductStatus } from '@prisma/client';

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

    // Start a transaction to update order status and product quantities
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // Update order status
      const updatedOrder = await tx.order.update({
        where: {
          id: parseInt(params.orderId)
        },
        data: {
          status
        }
      });

      // If order is being marked as DELIVERED, update product quantities and statuses
      if (status === OrderStatus.DELIVERED) {
        // Update stock quantity and status for each product in the order
        for (const item of order.items) {
          const updatedProduct = await tx.product.update({
            where: {
              id: item.productId
            },
            data: {
              stockQuantity: {
                decrement: item.quantity
              }
            }
          });

          // Update product status based on new stock quantity
          let newStatus: ProductStatus = ProductStatus.IN_STOCK;
          if (updatedProduct.stockQuantity <= 0) {
            newStatus = ProductStatus.OUT_OF_STOCK;
          } else if (updatedProduct.stockQuantity <= 5) {
            newStatus = ProductStatus.LOW_STOCK;
          }

          // Only update status if it has changed
          if (updatedProduct.status !== newStatus) {
            await tx.product.update({
              where: {
                id: item.productId
              },
              data: {
                status: newStatus
              }
            });
          }
        }
      }

      return updatedOrder;
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 