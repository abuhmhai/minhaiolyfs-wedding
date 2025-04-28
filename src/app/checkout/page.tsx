'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<{
    fullName: string;
    phone: string | null;
    address: string | null;
    email: string;
  } | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    note: ''
  });

  useEffect(() => {
    if (!session?.user) {
      router.push('/login');
      return;
    }

    if (items.length === 0) {
      router.push('/cart');
      return;
    }

    // Fetch user information
    const fetchUserInfo = async () => {
      try {
        const response = await fetch('/api/user');
        if (!response.ok) {
          throw new Error('Failed to fetch user information');
        }
        const data = await response.json();
        setUserInfo(data);
        setFormData(prev => ({
          ...prev,
          fullName: data.fullName || '',
          phone: data.phone || '',
          address: data.address || ''
        }));
      } catch (error) {
        console.error('Error fetching user information:', error);
        toast.error('Không thể tải thông tin người dùng');
      }
    };

    fetchUserInfo();
  }, [session, items, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Calculate total
      const total = items.reduce((sum, item) => {
        return sum + (item.product.price * item.quantity);
      }, 0);

      // Create order
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map(item => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.price,
            size: item.size,
            rentalDurationId: item.rentalDurationId
          })),
          total,
          note: formData.note
        }),
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to create order');
      }

      const order = await orderResponse.json();

      // Create MoMo payment request
      const paymentResponse = await fetch('/api/payment/momo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: order.id
        }),
      });

      if (!paymentResponse.ok) {
        throw new Error('Failed to create payment request');
      }

      const paymentData = await paymentResponse.json();

      // Check for specific MoMo error codes
      if (paymentData.resultCode === 41) {
        throw new Error('Đơn hàng đã tồn tại. Vui lòng thử lại sau.');
      } else if (paymentData.resultCode !== 0) {
        throw new Error(`Lỗi thanh toán: ${paymentData.message}`);
      }

      // Redirect to MoMo payment page
      if (paymentData.payUrl) {
        window.location.href = paymentData.payUrl;
      } else {
        console.error('No payment URL received:', paymentData);
        throw new Error('Không thể tạo yêu cầu thanh toán. Vui lòng thử lại sau.');
      }

    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error instanceof Error ? error.message : 'Đã có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!session?.user || items.length === 0 || !userInfo) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Your Order</h2>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.product.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{item.product.name}</p>
                  <p className="text-sm text-gray-500">
                    Size: {item.size} - Quantity: {item.quantity}
                  </p>
                </div>
                <p className="font-medium">
                  {(item.product.price * item.quantity).toLocaleString('vi-VN')}đ
                </p>
              </div>
            ))}
            <div className="border-t pt-4">
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>
                  {items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0).toLocaleString('vi-VN')}đ
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Checkout Form */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Shipping Information</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <Input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                value={userInfo.email}
                disabled
                className="bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number</label>
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <Textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Notes</label>
              <Textarea
                name="note"
                value={formData.note}
                onChange={handleChange}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Pay with MoMo'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
} 