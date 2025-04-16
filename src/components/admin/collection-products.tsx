'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: { url: string }[];
  category: Category;
}

interface Props {
  category: string;
}

export default function CollectionProducts({ category }: Props) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    images: [] as string[],
    category: category,
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [category]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else {
        toast.error('Không thể tải danh mục sản phẩm');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Có lỗi xảy ra khi tải danh mục sản phẩm');
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(`/api/products?category=${category}`);
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched products:', data.products);
        setProducts(data.products || []);
      } else {
        toast.error('Không thể tải danh sách sản phẩm');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Có lỗi xảy ra khi tải danh sách sản phẩm');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      images: product.images?.map(img => img.url) || [],
      category: product.category?.slug || category,
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      setProducts(products.filter(product => product.id !== id));
      toast.success('Xóa sản phẩm thành công');
    } catch (error) {
      toast.error('Không thể xóa sản phẩm');
      console.error('Error deleting product:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataObj = new FormData();
      formDataObj.append("name", formData.name);
      formDataObj.append("description", formData.description);
      formDataObj.append("price", formData.price);
      
      const selectedCategory = categories.find(cat => cat.slug === formData.category);
      if (!selectedCategory) {
        throw new Error('Danh mục không hợp lệ');
      }
      formDataObj.append("categoryId", selectedCategory.id.toString());
      
      formDataObj.append("status", "IN_STOCK");
      formDataObj.append("stockQuantity", "0");

      if (formData.images && formData.images.length > 0) {
        formData.images.forEach((url: string) => {
          formDataObj.append("images", url);
        });
      }

      const url = currentProduct
        ? `/api/admin/products/${currentProduct.id}`
        : '/api/admin/products';
      const method = currentProduct ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: formDataObj,
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save product');
      }

      const savedProduct = await response.json();
      
      if (currentProduct) {
        setProducts(products.map(p => 
          p.id === currentProduct.id ? savedProduct : p
        ));
        toast.success('Cập nhật sản phẩm thành công');
      } else {
        setProducts([...products, savedProduct]);
        toast.success('Thêm sản phẩm thành công');
      }

      resetForm();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(error instanceof Error ? error.message : 'Không thể lưu sản phẩm');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      images: [],
      category: category,
    });
    setCurrentProduct(null);
    setIsEditing(false);
  };

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-xl font-medium mb-4">
          {isEditing ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2">Tên sản phẩm</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block mb-2">Mô tả</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block mb-2">Giá</label>
            <Input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block mb-2">URL hình ảnh</label>
            <div className="space-y-2">
              {formData.images.map((url, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={url}
                    onChange={(e) => {
                      const newImages = [...formData.images];
                      newImages[index] = e.target.value;
                      setFormData({ ...formData, images: newImages });
                    }}
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => {
                      const newImages = formData.images.filter((_, i) => i !== index);
                      setFormData({ ...formData, images: newImages });
                    }}
                    disabled={isLoading}
                  >
                    Xóa
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => setFormData({ ...formData, images: [...formData.images, ''] })}
                disabled={isLoading}
              >
                Thêm hình ảnh
              </Button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Danh mục</label>
            <select
              name="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full border rounded-md px-3 py-2"
              required
              disabled={isLoading}
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading}>
              {isEditing ? 'Cập nhật' : 'Thêm mới'}
            </Button>
            {isEditing && (
              <Button type="button" variant="outline" onClick={resetForm} disabled={isLoading}>
                Hủy
              </Button>
            )}
          </div>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-medium mb-4">Danh sách sản phẩm</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="border rounded-lg p-4">
              <div className="relative h-48 mb-4 bg-gray-100 rounded-lg">
                {product.images && product.images.length > 0 ? (
                  <Image
                    src={product.images[0].url}
                    alt={product.name}
                    fill
                    className="object-cover rounded-lg"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    No image
                  </div>
                )}
              </div>
              <h3 className="font-medium mb-2">{product.name}</h3>
              <p className="text-gray-600 mb-2">{product.price.toLocaleString('vi-VN')}₫</p>
              <div className="flex gap-2">
                <Button onClick={() => handleEdit(product)} variant="outline" size="sm">
                  Sửa
                </Button>
                <Button onClick={() => handleDelete(product.id)} variant="destructive" size="sm">
                  Xóa
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 