'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  image: string;
  slug: string;
  category: string;
  color: string | null;
  categoryId: number;
  status: string;
  stockQuantity: number;
}

interface Category {
  id: number;
  name: string;
}

export default function AdminProducts() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const [products, setProducts] = useState<Product[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/');
      return;
    }

    fetchProducts();
    fetchCategories();
  }, [user, router]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        toast.error('Không thể tải danh sách sản phẩm');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Có lỗi xảy ra khi tải danh sách sản phẩm');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else {
        toast.error('Không thể tải danh sách danh mục');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Có lỗi xảy ra khi tải danh sách danh mục');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Xóa sản phẩm thành công');
        await fetchProducts();
      } else {
        toast.error('Không thể xóa sản phẩm');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Có lỗi xảy ra khi xóa sản phẩm');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      
      // Validate required fields
      if (!formData.get('name') || !formData.get('price') || !formData.get('categoryId')) {
        throw new Error('Vui lòng điền đầy đủ thông tin bắt buộc');
      }

      const url = editingProduct
        ? `/api/admin/products/${editingProduct.id}`
        : '/api/admin/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: formData,
      });

      if (response.ok) {
        toast.success(
          editingProduct
            ? 'Cập nhật sản phẩm thành công'
            : 'Thêm sản phẩm mới thành công'
        );
        setIsEditing(false);
        setEditingProduct(null);
        await fetchProducts();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Không thể lưu sản phẩm');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(error instanceof Error ? error.message : 'Có lỗi xảy ra khi lưu sản phẩm');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-medium">Quản lý sản phẩm</h1>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>
            Thêm sản phẩm mới
          </Button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tên sản phẩm</label>
              <Input
                name="name"
                defaultValue={editingProduct?.name}
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Mô tả</label>
              <Textarea
                name="description"
                defaultValue={editingProduct?.description || ''}
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Giá</label>
              <Input
                type="number"
                name="price"
                defaultValue={editingProduct?.price}
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Danh mục</label>
              <select
                name="categoryId"
                defaultValue={editingProduct?.categoryId}
                className="w-full border rounded-md px-3 py-2"
                required
                disabled={isLoading}
              >
                <option value="">Chọn danh mục</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Màu sắc</label>
              <Input
                name="color"
                defaultValue={editingProduct?.color || ''}
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Trạng thái</label>
              <select
                name="status"
                defaultValue={editingProduct?.status || 'IN_STOCK'}
                className="w-full border rounded-md px-3 py-2"
                required
                disabled={isLoading}
              >
                <option value="IN_STOCK">Còn hàng</option>
                <option value="OUT_OF_STOCK">Hết hàng</option>
                <option value="LOW_STOCK">Sắp hết hàng</option>
                <option value="DISCONTINUED">Ngừng kinh doanh</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Số lượng tồn kho</label>
              <Input
                type="number"
                name="stockQuantity"
                defaultValue={editingProduct?.stockQuantity || 0}
                min="0"
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Hình ảnh</label>
              <Input
                type="file"
                name="images"
                multiple
                accept="image/*"
                disabled={isLoading}
              />
            </div>
            <div className="flex space-x-4">
              <Button type="submit" disabled={isLoading}>
                {editingProduct ? 'Cập nhật' : 'Thêm mới'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setEditingProduct(null);
                }}
                disabled={isLoading}
              >
                Hủy
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative aspect-[3/4]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-lg mb-2 line-clamp-2">{product.name}</h3>
                <p className="text-primary font-medium mb-2">{product.price.toLocaleString('vi-VN')}₫</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-sm bg-gray-100 px-2 py-1 rounded">{product.category}</span>
                  {product.color && (
                    <span className="text-sm bg-gray-100 px-2 py-1 rounded">{product.color}</span>
                  )}
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEdit(product)}
                    className="hover:bg-gray-100"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(product.id)}
                    className="hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 