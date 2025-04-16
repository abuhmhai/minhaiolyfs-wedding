"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
  size?: string;
  rentalDurationId?: number;
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
  size,
  rentalDurationId,
}: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { addItem } = useCart();
  const { data: session, status } = useSession();

  const handleAddToCart = async () => {
    if (status === "unauthenticated") {
      router.push('/login');
      return;
    }

    try {
      setIsLoading(true);
      
      await addItem({
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
        size,
        rentalDurationId,
      });

      toast.success("Item added to cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
      if (error instanceof Error) {
        if (error.message.includes('login')) {
          toast.error("Please login to add items to cart");
          router.push('/login');
        } else {
          toast.error(error.message || "Failed to add item to cart");
        }
      } else {
        toast.error("Failed to add item to cart");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isLoading || status === "loading"}
      className="w-full bg-amber-800 hover:bg-amber-900 text-white"
    >
      {isLoading ? "Adding..." : "Add to Cart"}
    </Button>
  );
} 