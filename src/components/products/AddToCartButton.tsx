"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface AddToCartButtonProps {
  productId: number;
}

export default function AddToCartButton({ productId }: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAddToCart = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          quantity: 1,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add to cart");
      }

      router.refresh();
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isLoading}
      className="btn btn-primary w-full"
    >
      {isLoading ? "Adding..." : "Add to Cart"}
    </button>
  );
} 