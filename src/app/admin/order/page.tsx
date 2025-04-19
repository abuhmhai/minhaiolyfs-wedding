'use client';

import { useEffect, useState } from 'react';
import { Order, OrderItem, Product, OrderStatus, ProductImage } from '@prisma/client';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { toast } from 'sonner';
import Link from 'next/link';
import { Eye } from 'lucide-react';

type ProductWithImages = Product & {
  images: ProductImage[];
};

type OrderWithItems = Order & {
  orderItems: (OrderItem & {
    product: ProductWithImages;
  })[];
};

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.PENDING:
      return 'bg-yellow-100 text-yellow-800';
    case OrderStatus.PROCESSING:
      return 'bg-blue-100 text-blue-800';
    case OrderStatus.SHIPPED:
      return 'bg-purple-100 text-purple-800';
    case OrderStatus.DELIVERED:
      return 'bg-green-100 text-green-800';
    case OrderStatus.CANCELLED:
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusText = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.PENDING:
      return 'Chờ xử lý';
    case OrderStatus.PROCESSING:
      return 'Đang xử lý';
    case OrderStatus.SHIPPED:
      return 'Đang giao hàng';
    case OrderStatus.DELIVERED:
      return 'Đã giao hàng';
    case OrderStatus.CANCELLED:
      return 'Đã hủy';
    default:
      return status;
  }
};

export default function AdminOrderPage() {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/admin/orders');
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      
      if (!Array.isArray(data)) {
        throw new Error('Invalid data format received from server');
      }

      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while fetching orders');
      toast.error('Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: number, status: OrderStatus) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update order status');
      }

      toast.success('Cập nhật trạng thái đơn hàng thành công');
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Không thể cập nhật trạng thái đơn hàng');
    }
  };

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
            onClick={fetchOrders}
            className="mt-4 px-4 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Quản lý đơn hàng</h1>
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">Chưa có đơn hàng nào</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Quản lý đơn hàng</h1>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã đơn hàng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày đặt
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sản phẩm
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tổng tiền
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 cursor-pointer">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <Link href={`/admin/orders/${order.id}`} className="flex items-center text-blue-600 hover:text-blue-800">
                    #{order.id}
                    <Eye className="h-4 w-4 ml-2" />
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div className="space-y-1">
                    {order.orderItems?.map((item) => (
                      <div key={item.id} className="flex items-center gap-2">
                        <div className="w-8 h-8 relative rounded overflow-hidden">
                          {item.product.images?.[0] && (
                            <img
                              src={item.product.images[0].url}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-gray-500 text-xs">
                            Size: {item.size} - Số lượng: {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {order.total.toLocaleString('vi-VN')}đ
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {order.status === OrderStatus.PENDING && (
                    <button
                      onClick={() => updateOrderStatus(order.id, OrderStatus.PROCESSING)}
                      className="text-blue-600 hover:text-blue-900 mr-2"
                    >
                      Xử lý
                    </button>
                  )}
                  {order.status === OrderStatus.PROCESSING && (
                    <button
                      onClick={() => updateOrderStatus(order.id, OrderStatus.SHIPPED)}
                      className="text-purple-600 hover:text-purple-900 mr-2"
                    >
                      Giao hàng
                    </button>
                  )}
                  {order.status === OrderStatus.SHIPPED && (
                    <button
                      onClick={() => updateOrderStatus(order.id, OrderStatus.DELIVERED)}
                      className="text-green-600 hover:text-green-900 mr-2"
                    >
                      Hoàn thành
                    </button>
                  )}
                  {order.status !== OrderStatus.CANCELLED && order.status !== OrderStatus.DELIVERED && (
                    <button
                      onClick={() => updateOrderStatus(order.id, OrderStatus.CANCELLED)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Hủy
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 