"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Image from "next/image";
import { useCart } from "@/hooks/useCart";
import Link from "next/link";

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity } = useCart();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Giỏ hàng của bạn</h1>
      {items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600 mb-4">Giỏ hàng của bạn đang trống</p>
          <div className="mt-6 flex justify-between">
            <Link
              href={items.some(item => item.type === 'ao-dai') ? '/collections/ao-dai' : '/collections/ao-cuoi'}
              className="text-sm font-medium text-amber-800 hover:text-amber-900"
            >
              ← Tiếp tục mua hàng
            </Link>
            <Button
              onClick={() => router.push("/checkout")}
              className="bg-amber-800 hover:bg-amber-900 text-white"
            >
              Thanh toán
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-6">
          {items.map((item) => (
            <Card key={item.productId} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative w-24 h-24">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <p className="text-gray-600">
                        {item.price.toLocaleString('vi-VN')}₫
                      </p>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm text-gray-500">
                          Màu sắc: {item.color}
                        </p>
                        <p className="text-sm text-gray-500">
                          Kiểu dáng: {item.style}
                        </p>
                        <p className="text-sm text-gray-500">
                          Thời gian thuê: {item.rentalStartDate.toLocaleDateString('vi-VN')} - {item.rentalEndDate.toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              Math.max(1, item.quantity - 1)
                            )
                          }
                        >
                          -
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={() => removeItem(item.productId)}
                    className="ml-4"
                  >
                    Xóa
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Tổng cộng:</span>
              <span className="text-xl font-bold">{total.toLocaleString('vi-VN')}₫</span>
            </div>
            <div className="mt-6 flex justify-between">
              <Link
                href={items.some(item => item.type === 'ao-dai') ? '/collections/ao-dai' : '/collections/ao-cuoi'}
                className="text-sm font-medium text-amber-800 hover:text-amber-900"
              >
                ← Tiếp tục mua hàng
              </Link>
              <Button
                onClick={() => router.push("/checkout")}
                className="bg-amber-800 hover:bg-amber-900 text-white"
              >
                Thanh toán
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 