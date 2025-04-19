'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import Image from 'next/image';
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

export default function OrderDetailsPage({ params }: { params: PageParams }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);

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
        toast.error('Không thể tải danh sách đơn hàng');
      }
    };

    const fetchOrder = async () => {
      try {
        if (!params.orderId) {
          throw new Error('Order ID is required');
        }

        const response = await fetch(`/api/orders/${params.orderId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch order');
        }
        const data = await response.json();
        setOrder(data);
      } catch (error) {
        console.error('Error fetching order:', error);
        toast.error('Không thể tải thông tin đơn hàng');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
    fetchOrder();
  }, [session, router, params.orderId]);

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
          <h1 className="text-2xl font-bold mb-4">Không tìm thấy đơn hàng</h1>
          <button
            onClick={() => router.push('/account/orders')}
            className="text-blue-600 hover:underline"
          >
            Quay lại danh sách đơn hàng
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Chi tiết đơn hàng #{order.id}</h1>
          <Select value={params.orderId} onValueChange={handleOrderChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Chọn đơn hàng" />
            </SelectTrigger>
            <SelectContent>
              {orders.map((order) => (
                <SelectItem key={order.id} value={order.id.toString()}>
                  Đơn hàng #{order.id} - {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Sản phẩm đã đặt</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items?.map((item: any) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-24 h-24">
                      <Image
                        src={item.product?.images?.[0] || '/placeholder.jpg'}
                        alt={item.product?.name || 'Product image'}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.product?.name}</h3>
                      <p className="text-sm text-gray-500">
                        Size: {item.size} - Số lượng: {item.quantity}
                      </p>
                      {item.rentalDuration && (
                        <p className="text-sm text-gray-500">
                          Thời gian thuê: {item.rentalDuration.name}
                        </p>
                      )}
                      <p className="font-medium mt-1">
                        {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                      </p>
                    </div>
                  </div>
                ))}
                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold">
                    <span>Tổng cộng:</span>
                    <span>{order.total.toLocaleString('vi-VN')}đ</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Information */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin giao hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Trạng thái đơn hàng</h3>
                  <p className="text-sm text-gray-500 capitalize">{order.status.toLowerCase()}</p>
                </div>
                <div>
                  <h3 className="font-medium">Người nhận</h3>
                  <p className="text-sm text-gray-500">{order.fullName}</p>
                </div>
                <div>
                  <h3 className="font-medium">Số điện thoại</h3>
                  <p className="text-sm text-gray-500">{order.phone}</p>
                </div>
                <div>
                  <h3 className="font-medium">Địa chỉ giao hàng</h3>
                  <p className="text-sm text-gray-500">{order.address}</p>
                </div>
                {order.note && (
                  <div>
                    <h3 className="font-medium">Ghi chú</h3>
                    <p className="text-sm text-gray-500">{order.note}</p>
                  </div>
                )}
                <div>
                  <h3 className="font-medium">Ngày đặt hàng</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 