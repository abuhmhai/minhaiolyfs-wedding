"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";

interface AddToCartButtonProps {
  productId: number;
  name: string;
  price: number;
  image: string;
  color: string;
  type: string;
  style: string;
  rentalStartDate: Date;
  rentalEndDate: Date;
}

export default function AddToCartButton({
  productId,
  name,
  price,
  image,
  color,
  type,
  style,
  rentalStartDate,
  rentalEndDate,
}: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { addItem } = useCart();

  const handleAddToCart = async () => {
    try {
      setIsLoading(true);
      
      // First, add to local cart state
      addItem({
        productId,
        name,
        price,
        image,
        quantity: 1,
        color,
        type,
        style,
        rentalStartDate,
        rentalEndDate,
      });

      // Then sync with database
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          quantity: 1,
          color,
          type,
          style,
          rentalStartDate: rentalStartDate.toISOString(),
          rentalEndDate: rentalEndDate.toISOString(),
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