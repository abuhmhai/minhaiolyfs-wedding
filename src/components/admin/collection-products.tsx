'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

interface Props {
  category: string;
}

export default function CollectionProducts({ category }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
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
        setProducts(data);
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
      description: product.description,
      price: product.price.toString(),
      image: product.image,
      category: product.category,
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete product');

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
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
      };

      const url = currentProduct
        ? `/api/products/${currentProduct.id}`
        : '/api/products';
      const method = currentProduct ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) throw new Error('Failed to save product');

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
      toast.error('Không thể lưu sản phẩm');
      console.error('Error saving product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      image: '',
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
            <Input
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Danh mục</label>
            <select
              name="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full border rounded-md px-3 py-2"
              required
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
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
              <div className="relative h-48 mb-4">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <h3 className="font-medium mb-2">{product.name}</h3>
              <p className="text-gray-600 mb-2">{product.description}</p>
              <p className="font-medium mb-4">{product.price.toLocaleString()} VNĐ</p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleEdit(product)}
                  disabled={isLoading}
                >
                  Chỉnh sửa
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(product.id)}
                  disabled={isLoading}
                >
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