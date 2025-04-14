import { useState } from "react";
import { Product, Category } from "@prisma/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ProductFormProps {
  product?: Product & {
    images: { url: string }[];
  };
  categories: Category[];
}

export default function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter();
  const [name, setName] = useState(product?.name || "");
  const [description, setDescription] = useState(product?.description || "");
  const [price, setPrice] = useState(product?.price?.toString() || "");
  const [categoryId, setCategoryId] = useState(product?.categoryId?.toString() || "");
  const [color, setColor] = useState(product?.color || "");
  const [status, setStatus] = useState(product?.status || "IN_STOCK");
  const [images, setImages] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate required fields
      if (!name || !price || !categoryId) {
        throw new Error("Please fill in all required fields");
      }

      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("categoryId", categoryId);
      formData.append("color", color);
      formData.append("status", status);
      
      // Log form data for debugging
      console.log("Form data being sent:", {
        name,
        description,
        price,
        categoryId,
        color,
        status,
        imagesCount: images.length
      });

      // Handle images
      if (images.length > 0) {
        images.forEach((image) => {
          formData.append("images", image);
        });
      } else if (product?.images) {
        // If editing and no new images selected, keep existing images
        product.images.forEach((image) => {
          formData.append("existingImages", image.url);
        });
      }

      const url = product
        ? `/api/admin/products/${product.id}`
        : "/api/admin/products";
      const method = product ? "PUT" : "POST";

      console.log("Sending request to:", url, "with method:", method);

      const response = await fetch(url, {
        method,
        body: formData,
      });

      console.log("Response status:", response.status);

      const responseData = await response.json();
      console.log("Response data:", responseData);

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to save product");
      }

      toast.success(product ? "Cập nhật sản phẩm thành công" : "Thêm sản phẩm mới thành công");
      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error(error instanceof Error ? error.message : "Không thể lưu sản phẩm");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label
          htmlFor="price"
          className="block text-sm font-medium text-gray-700"
        >
          Price
        </label>
        <input
          type="number"
          id="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          step="0.01"
          min="0"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700"
        >
          Category
        </label>
        <select
          id="category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="color"
          className="block text-sm font-medium text-gray-700"
        >
          Color
        </label>
        <input
          type="text"
          id="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label
          htmlFor="status"
          className="block text-sm font-medium text-gray-700"
        >
          Status
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as "IN_STOCK" | "OUT_OF_STOCK")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        >
          <option value="IN_STOCK">In Stock</option>
          <option value="OUT_OF_STOCK">Out of Stock</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="images"
          className="block text-sm font-medium text-gray-700"
        >
          Images
        </label>
        <input
          type="file"
          id="images"
          multiple
          onChange={(e) => {
            if (e.target.files) {
              setImages(Array.from(e.target.files));
            }
          }}
          className="mt-1 block w-full"
          accept="image/*"
        />
        {product?.images && product.images.length > 0 && (
          <div className="mt-2">
            <p className="text-sm text-gray-500">Current images:</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {product.images.map((image, index) => (
                <div key={index} className="text-sm text-gray-600">
                  {image.url}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {isLoading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
} 