'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Order, OrderItem, Product, OrderStatus, ProductImage } from '@prisma/client';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { toast } from 'sonner';
import Link from 'next/link';
import Image from 'next/image';

type ProductWithImages = Product & {
  images: ProductImage[];
};

type OrderWithItems = Order & {
  items: (OrderItem & {
    product: ProductWithImages;
  })[];
  user: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
  };
};

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = params?.orderId as string;
  const [order, setOrder] = useState<OrderWithItems | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/admin/orders/${orderId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch order');
      }

      const data = await response.json();
      setOrder(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch order');
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 mb-4">{error}</p>
        <Link href="/admin/order" className="text-blue-500 hover:underline">
          Back to Orders
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-gray-500 mb-4">Order not found</p>
        <Link href="/admin/order" className="text-blue-500 hover:underline">
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/admin/order" className="text-blue-500 hover:underline">
          ← Back to Orders
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold mb-6">Order Details</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Order Information</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Order ID:</span> {order.id}</p>
              <p><span className="font-medium">Status:</span> {order.status}</p>
              <p><span className="font-medium">Created:</span> {format(new Date(order.createdAt), 'PPP', { locale: vi })}</p>
              <p><span className="font-medium">Total:</span> {order.total.toLocaleString('vi-VN')}đ</p>
            </div>

            <h2 className="text-lg font-semibold mt-6 mb-4">Customer Information</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Name:</span> {order.user?.fullName || 'N/A'}</p>
              <p><span className="font-medium">Email:</span> {order.user?.email || 'N/A'}</p>
              <p><span className="font-medium">Phone:</span> {order.user?.phone || 'N/A'}</p>
              <p><span className="font-medium">Address:</span> {order.user?.address || 'N/A'}</p>
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-4">Items</h2>
            {order.items?.map((item) => (
              <div key={item.id} className="border-b py-4">
                <div className="flex items-center gap-4">
                  {item.product.images?.[0] && (
                    <Image
                      src={item.product.images[0].url}
                      alt={item.product.name}
                      width={80}
                      height={80}
                      className="rounded"
                    />
                  )}
                  <div>
                    <p className="font-medium">{item.product.name}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Price: {item.price.toLocaleString('vi-VN')}đ</p>
                    <p>Subtotal: {(item.price * item.quantity).toLocaleString('vi-VN')}đ</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 