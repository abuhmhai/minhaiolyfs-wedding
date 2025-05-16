'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import Image from 'next/image';
import { use } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PageParams {
  orderId: string;
}
export default function OrderDetailsPage({ params }: { params: Promise<PageParams> }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const { orderId } = use(params);

  useEffect(() => {
    if (!session?.user) {
      router.push('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders');
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Cannot load order list');
      }
    };

    const fetchOrder = async () => {
      try {
        if (!orderId) {
          throw new Error('Order ID is required');
        }

        const response = await fetch(`/api/orders/${orderId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch order');
        }
        const data = await response.json();
        setOrder(data);
      } catch (error) {
        console.error('Error fetching order:', error);
        toast.error('Cannot load order information');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
    fetchOrder();
  }, [session, router, orderId]);

  const handleOrderChange = (value: string) => {
    router.push(`/account/orders/${value}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Order not found</h1>
          <button
            onClick={() => router.push('/account/orders')}
            className="text-blue-600 hover:underline"
          >
            Back to orders list
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Order Details #{order.id}</h1>
          <Select value={orderId} onValueChange={handleOrderChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select order" />
            </SelectTrigger>
            <SelectContent>
              {orders.map((order) => (
                <SelectItem key={order.id} value={order.id.toString()}>
                  Order #{order.id} - {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Ordered Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {order.items?.map((item: any) => (
                  <div key={item.id} className="flex gap-6 p-4 bg-gray-50 rounded-lg">
                    <div className="relative w-32 h-32 flex-shrink-0">
                      {item.product?.images?.[0]?.url ? (
                        <Image
                          src={item.product.images[0].url}
                          alt={item.product?.name || 'Product image'}
                          fill
                          className="object-cover rounded-lg"
                          sizes="(max-width: 128px) 100vw, 128px"
                          priority
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-gray-400">No image</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-lg mb-2">{item.product?.name}</h3>
                      <div className="space-y-1 text-gray-600">
                        <p className="text-sm">
                          <span className="font-medium">Size:</span> {item.size}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Quantity:</span> {item.quantity}
                        </p>
                        {item.rentalDuration && (
                          <p className="text-sm">
                            <span className="font-medium">Rental Duration:</span> {item.rentalDuration.name}
                          </p>
                        )}
                        <p className="text-lg font-medium text-primary mt-2">
                          {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span className="text-primary">{order.total.toLocaleString('vi-VN')}đ</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Information */}
          <Card>
            <CardHeader>
              <CardTitle>Order Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-lg mb-3">Order Status</h3>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full ${
                    order.status === 'DELIVERED' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {order.status === 'DELIVERED' ? 'Delivered' : order.status}
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-lg mb-3">Shipping Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Recipient</p>
                      <p className="font-medium">{order.user?.fullName || 'No information'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone Number</p>
                      <p className="font-medium">{order.user?.phone || 'No information'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Shipping Address</p>
                      <p className="font-medium">{order.user?.address || 'No information'}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-lg mb-3">Order Details</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Order Date</p>
                      <p className="font-medium">
                        {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    {order.note && (
                      <div>
                        <p className="text-sm text-gray-500">Notes</p>
                        <p className="font-medium">{order.note}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 