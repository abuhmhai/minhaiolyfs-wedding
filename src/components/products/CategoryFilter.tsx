"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Category } from "@prisma/client";

interface CategoryFilterProps {
  categories: Category[];
}

export default function CategoryFilter({ categories }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category");

  const handleCategoryChange = (categoryId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (categoryId) {
      params.set("category", categoryId);
    } else {
      params.delete("category");
    }
    
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => handleCategoryChange("")}
        className={`px-4 py-2 rounded-md ${
          !selectedCategory
            ? "bg-blue-500 text-white"
            : "bg-gray-100 hover:bg-gray-200"
        }`}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => handleCategoryChange(category.id.toString())}
          className={`px-4 py-2 rounded-md ${
            selectedCategory === category.id.toString()
              ? "bg-blue-500 text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
} 