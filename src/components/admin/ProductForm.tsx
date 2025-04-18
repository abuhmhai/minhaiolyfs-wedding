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
    price: product?.price || 0,
    categoryId: product?.categoryId?.toString() || "",
    stockQuantity: product?.stockQuantity?.toString() || "",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataObj = new FormData();
      formDataObj.append('name', formData.name);
      formDataObj.append('description', formData.description || '');
      formDataObj.append('price', formData.price.toString());
      formDataObj.append('categoryId', formData.categoryId);
      formDataObj.append('stockQuantity', formData.stockQuantity);
      formDataObj.append('status', formData.status);
      formDataObj.append('style', formData.style);
      formDataObj.append('color', formData.color);
      
      // Handle images properly
      if (product) {
        // When editing, only send the current set of images
        formData.images.forEach((url: string) => {
          formDataObj.append('existingImages', url);
        });
      } else {
        // When creating new product, send all images
        formData.images.forEach((url: string) => {
          formDataObj.append('images', url);
        });
      }

      const response = await fetch(`/api/admin/products${product ? `/${product.id}` : ''}`, {
        method: product ? 'PUT' : 'POST',
        body: formDataObj,
      });

      if (!response.ok) {
        throw new Error('Failed to save product');
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
                    type="number"
                    id="price"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    required
                    min="0"
                    step="0.01"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="stockQuantity" className="block text-sm font-medium text-gray-700 mb-1">
                  Số Lượng Trong Kho
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    id="stockQuantity"
                    value={formData.stockQuantity}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData(prev => ({ ...prev, stockQuantity: value }));
                      updateStatusBasedOnQuantity(value);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    required
                    min="0"
                    placeholder="Nhập số lượng"
                  />
                </div>
                {formData.status === ProductStatus.LOW_STOCK && (
                  <p className="mt-2 text-sm text-yellow-600 flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 17a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0v-3a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Sắp hết hàng. Vui lòng nhập thêm hàng sớm.
                  </p>
                )}
                {formData.status === ProductStatus.OUT_OF_STOCK && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    Hết hàng. Cập nhật số lượng để bán lại.
                  </p>
                )}
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
                    required
                  >
                    <option value="">Chọn kiểu dáng</option>
                    <option value="dang-xoe-ballgown">Dáng xòe/Ballgown</option>
                    <option value="dang-chu-a">Dáng chữ A</option>
                    <option value="dang-duoi-ca-mermaid">Dáng đuôi cá/Mermaid</option>
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
                  required
                >
                  <option value="">Chọn màu sắc</option>
                  {formData.categoryId && categories.find(c => c.id === parseInt(formData.categoryId))?.slug === 'ao-cuoi' ? (
                    <>
                      <option value="offwhite">Offwhite</option>
                      <option value="ivory">Ivory</option>
                      <option value="nude">Nude</option>
                    </>
                  ) : (
                    <>
                      <option value="do">Đỏ</option>
                      <option value="hong">Hồng</option>
                      <option value="trang">Trắng</option>
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