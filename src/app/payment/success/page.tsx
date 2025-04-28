'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const resultCode = searchParams.get('resultCode');
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      toast.error('Order information not found');
      router.push('/cart');
      return;
    }

    if (resultCode === '0') {
      toast.success('Payment successful!');
      // Redirect to order details page
      router.push(`/account/orders/${orderId}`);
    } else {
      toast.error('Payment failed. Please try again.');
      router.push('/cart');
    }
  }, [searchParams, router]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Processing payment...</h1>
        <p className="text-gray-600">Please wait a moment.</p>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Đang tải...</h1>
            <p className="text-gray-600">Vui lòng đợi trong giây lát.</p>
          </div>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
} 