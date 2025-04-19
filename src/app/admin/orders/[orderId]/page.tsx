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
  orderItems: (OrderItem & {
    product: ProductWithImages;
  })[];
  fullName: string;
  phone: string;
  address: string;
  note: string | null;
  total: number;
  status: OrderStatus;
  createdAt: Date;
};

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = params?.orderId as string;
  const [order, setOrder] = useState<OrderWithItems | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

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
      console.error('Error fetching order:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while fetching order');
      toast.error('Không thể tải thông tin đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (newStatus: OrderStatus) => {
    try {
      setUpdatingStatus(true);
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update order status');
      }

      const updatedOrder = await response.json();
      setOrder(updatedOrder);
      toast.success('Cập nhật trạng thái đơn hàng thành công');
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Không thể cập nhật trạng thái đơn hàng');
    } finally {
      setUpdatingStatus(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-red-800 font-medium mb-2">Lỗi</h2>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => {
              fetchOrder();
            }}
            className="mt-4 px-4 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">Không tìm thấy đơn hàng</p>
          <Link href="/admin/order" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
            Quay lại danh sách đơn hàng
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Chi tiết đơn hàng #{order.id}</h1>
        <Link
          href="/admin/order"
          className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
        >
          Quay lại danh sách đơn hàng
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Order Items */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Sản phẩm</h2>
          <div className="space-y-4">
            {order.orderItems.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                <div className="relative w-24 h-24 rounded overflow-hidden">
                  {item.product.images?.[0] && (
                    <Image
                      src={item.product.images[0].url}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{item.product.name}</h3>
                  <p className="text-gray-500 text-sm">
                    Size: {item.size || 'N/A'} - Số lượng: {item.quantity}
                  </p>
                  <p className="text-gray-900 font-medium mt-1">
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
        </div>

        {/* Order Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Thông tin đơn hàng</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Trạng thái</h3>
              <div className="mt-2 flex items-center gap-2">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  order.status === OrderStatus.PENDING ? 'bg-yellow-100 text-yellow-800' :
                  order.status === OrderStatus.PROCESSING ? 'bg-blue-100 text-blue-800' :
                  order.status === OrderStatus.SHIPPED ? 'bg-purple-100 text-purple-800' :
                  order.status === OrderStatus.DELIVERED ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {order.status === OrderStatus.PENDING ? 'Chờ xử lý' :
                   order.status === OrderStatus.PROCESSING ? 'Đang xử lý' :
                   order.status === OrderStatus.SHIPPED ? 'Đang giao hàng' :
                   order.status === OrderStatus.DELIVERED ? 'Đã giao hàng' :
                   'Đã hủy'}
                </span>
                {order.status !== OrderStatus.DELIVERED && order.status !== OrderStatus.CANCELLED && (
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(e.target.value as OrderStatus)}
                    disabled={updatingStatus}
                    className="ml-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value={OrderStatus.PENDING}>Chờ xử lý</option>
                    <option value={OrderStatus.PROCESSING}>Đang xử lý</option>
                    <option value={OrderStatus.SHIPPED}>Đang giao hàng</option>
                    <option value={OrderStatus.DELIVERED}>Đã giao hàng</option>
                    <option value={OrderStatus.CANCELLED}>Hủy đơn hàng</option>
                  </select>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Ngày đặt hàng</h3>
              <p className="mt-1">
                {format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Người đặt</h3>
              <p className="mt-1">{order.fullName || 'Không có thông tin'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Số điện thoại</h3>
              <p className="mt-1">{order.phone || 'Không có thông tin'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Địa chỉ giao hàng</h3>
              <p className="mt-1">{order.address || 'Không có thông tin'}</p>
            </div>
            {order.note && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Ghi chú</h3>
                <p className="mt-1">{order.note}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 