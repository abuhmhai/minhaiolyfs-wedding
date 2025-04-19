'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const resultCode = searchParams.get('resultCode');
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      toast.error('Không tìm thấy thông tin đơn hàng');
      router.push('/cart');
      return;
    }

    if (resultCode === '0') {
      toast.success('Thanh toán thành công!');
      // Redirect to order details page
      router.push(`/account/orders/${orderId}`);
    } else {
      toast.error('Thanh toán thất bại. Vui lòng thử lại.');
      router.push('/cart');
    }
  }, [searchParams, router]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Đang xử lý thanh toán...</h1>
        <p className="text-gray-600">Vui lòng đợi trong giây lát.</p>
      </div>
    </div>
  );
} 