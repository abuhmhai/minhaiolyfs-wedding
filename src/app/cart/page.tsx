"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
  };
}

export default function CartPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      fetchCart();
    }
  }, [status]);

  const fetchCart = async () => {
    try {
      const response = await fetch("/api/cart");
      if (!response.ok) throw new Error("Failed to fetch cart");
      const data = await response.json();
      setCart(data.items || []);
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      const response = await fetch(`/api/cart?productId=${productId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to remove item");
      toast.success("Item removed from cart");
      fetchCart();
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Failed to remove item");
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, quantity }),
      });
      if (!response.ok) throw new Error("Failed to update quantity");
      fetchCart();
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      {cart.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">Your cart is empty</p>
          <Button
            onClick={() => router.push("/products")}
            className="mt-4"
          >
            Continue Shopping
          </Button>
        </div>
      ) : (
        <div className="grid gap-6">
          {cart.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle>{item.product.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div>
                      <p className="font-semibold">
                        ${item.product.price.toFixed(2)}
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              Math.max(1, item.quantity - 1)
                            )
                          }
                        >
                          -
                        </Button>
                        <span>{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={() => removeFromCart(item.product.id)}
                  >
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          <div className="flex justify-end">
            <Button
              onClick={() => router.push("/checkout")}
              className="w-full sm:w-auto"
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 