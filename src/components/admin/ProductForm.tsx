'use client';

import { useState } from "react";
import { Product, Category, ProductStatus } from "@prisma/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ProductFormProps {
  product?: Product & {
    category: Category;
    images: { url: string }[];
    style?: string;
    color?: string;
  };
  categories: Category[];
}

export default function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price?.toString() || "0",
    categoryId: product?.categoryId?.toString() || "",
    stockQuantity: product?.stockQuantity?.toString() || "0",
    status: product?.status || ProductStatus.IN_STOCK,
    images: product?.images.map(img => img.url) || [],
    style: product?.style || "",
    color: product?.color || "",
  });

  const [imageUrls, setImageUrls] = useState<string[]>(product?.images.map(img => img.url) || [""]);

  const addImageUrl = () => {
    setImageUrls(prev => [...prev, ""]);
  };

  const removeImageUrl = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const updateImageUrl = (index: number, url: string) => {
    setImageUrls(prev => {
      const newImageUrls = [...prev];
      newImageUrls[index] = url;
      return newImageUrls;
    });
    
    setFormData(prev => {
      const newImages = [...prev.images];
      if (url) {
        newImages[index] = url;
      } else {
        newImages.splice(index, 1);
      }
      return {
        ...prev,
        images: newImages.filter(Boolean)
      };
    });
  };

  const updateStatusBasedOnQuantity = (quantity: string) => {
    const qty = parseInt(quantity) || 0;
    let newStatus = formData.status;

    if (qty <= 0) {
      newStatus = ProductStatus.OUT_OF_STOCK;
    } else if (qty < 10) {
      newStatus = ProductStatus.LOW_STOCK;
    } else {
      newStatus = ProductStatus.IN_STOCK;
    }

    setFormData(prev => ({ ...prev, status: newStatus }));
  };

  const getStatusColor = (status: ProductStatus) => {
    switch (status) {
      case ProductStatus.IN_STOCK:
        return "bg-green-100 text-green-800";
      case ProductStatus.OUT_OF_STOCK:
        return "bg-red-100 text-red-800";
      case ProductStatus.LOW_STOCK:
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: ProductStatus) => {
    switch (status) {
      case ProductStatus.IN_STOCK:
        return "In Stock";
      case ProductStatus.OUT_OF_STOCK:
        return "Out of Stock";
      case ProductStatus.LOW_STOCK:
        return "Low Stock";
      default:
        return status;
    }
  };

  const handleNumericInput = (field: string, value: string) => {
    // Only allow numbers and empty string
    if (value === "" || /^\d+$/.test(value)) {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const productData = {
        name: formData.name,
        description: formData.description || '',
        price: parseFloat(formData.price) || 0,
        categoryId: parseInt(formData.categoryId),
        stockQuantity: parseInt(formData.stockQuantity) || 0,
        status: formData.status,
        style: formData.style,
        color: formData.color,
        images: formData.images,
      };

      const response = await fetch(`/api/admin/products${product ? `/${product.id}` : ''}`, {
        method: product ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save product');
      }

      toast.success(`Product ${product ? 'updated' : 'created'} successfully`);
      router.push('/admin/products');
      router.refresh();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload images');
      }

      const data = await response.json();
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...data.urls],
      }));
      setImageUrls(prev => [...prev, ...data.urls]);
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Failed to upload images');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {product ? 'Chỉnh Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
        </h2>
        <div className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(formData.status)}`}>
          {getStatusText(formData.status)}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Basic Information Section */}
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Thông Tin Cơ Bản</h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Tên Sản Phẩm
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Nhập tên sản phẩm"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Mô Tả
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  rows={4}
                  placeholder="Nhập mô tả sản phẩm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Pricing and Inventory Section */}
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Giá & Kho Hàng</h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Giá
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-2 text-gray-500">đ</span>
                  <input
                    type="text"
                    id="price"
                    value={formData.price}
                    onChange={(e) => handleNumericInput('price', e.target.value)}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Nhập giá sản phẩm"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="stockQuantity" className="block text-sm font-medium text-gray-700 mb-1">
                  Số Lượng
                </label>
                <input
                  type="text"
                  id="stockQuantity"
                  value={formData.stockQuantity}
                  onChange={(e) => handleNumericInput('stockQuantity', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Nhập số lượng"
                  required
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Danh Mục
                </label>
                <select
                  id="category"
                  value={formData.categoryId}
                  onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  required
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Show style field only for wedding dresses */}
              {formData.categoryId && categories.find(c => c.id === parseInt(formData.categoryId))?.slug === 'ao-cuoi' && (
                <div>
                  <label htmlFor="style" className="block text-sm font-medium text-gray-700 mb-1">
                    Kiểu Dáng
                  </label>
                  <select
                    id="style"
                    value={formData.style}
                    onChange={(e) => setFormData(prev => ({ ...prev, style: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    required={!product}
                  >
                    <option value="">Chọn kiểu dáng</option>
                    <option value="DANG_XOE_BALLGOWN">Dáng xòe/Ballgown</option>
                    <option value="DANG_CHU_A">Dáng chữ A</option>
                    <option value="DANG_DUOI_CA_MERMAID">Dáng đuôi cá/Mermaid</option>
                  </select>
                </div>
              )}

              {/* Show color field for both categories */}
              <div>
                <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
                  Màu Sắc
                </label>
                <select
                  id="color"
                  value={formData.color}
                  onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  required={!product}
                >
                  <option value="">Chọn màu sắc</option>
                  {formData.categoryId && categories.find(c => c.id === parseInt(formData.categoryId))?.slug === 'ao-cuoi' ? (
                    <>
                      <option value="OFFWHITE">Offwhite</option>
                      <option value="IVORY">Ivory</option>
                      <option value="NUDE">Nude</option>
                    </>
                  ) : (
                    <>
                      <option value="DO">Đỏ</option>
                      <option value="HONG">Hồng</option>
                      <option value="TRANG">Trắng</option>
                    </>
                  )}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Images Section */}
      <div className="mt-8">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Hình Ảnh Sản Phẩm</h3>
          
          <div className="space-y-4">
            {/* Image Upload Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tải Lên Hình Ảnh
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>

            {/* Image URLs Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL Hình Ảnh
              </label>
              <div className="space-y-3">
                {imageUrls.map((url, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => updateImageUrl(index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Nhập URL hình ảnh"
                    />
                    <button
                      type="button"
                      onClick={() => removeImageUrl(index)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-1 border-2 border-red-700 shadow-sm hover:shadow"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Xóa
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addImageUrl}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 border-2 border-blue-700 shadow-md hover:shadow-lg"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Thêm URL Hình Ảnh Mới
                </button>
              </div>
            </div>

            {/* Preview Section */}
            {formData.images.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Xem Trước Hình Ảnh
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {formData.images.map((url, index) => (
                    <div key={index} className="relative aspect-square">
                      <img
                        src={url}
                        alt={`Xem trước ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Hủy
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Đang Lưu...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {product ? 'Cập Nhật Sản Phẩm' : 'Tạo Sản Phẩm'}
            </>
          )}
        </button>
      </div>
    </form>
  );
} 