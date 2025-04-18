'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Filter, Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { prisma } from '@/lib/prisma';

interface AoDaiProduct {
  id: number;
  name: string;
  price: number;
  images: { url: string }[];
  slug: string;
  color: string;
  createdAt: Date;
}

type FilterCategory = 'color' | 'price';

const AoDaiCollection = () => {
  const [expandedFilters, setExpandedFilters] = useState<FilterCategory[]>(['color', 'price']);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([500000, 8000000]);
  const [sortOrder, setSortOrder] = useState<string>('featured');
  const [products, setProducts] = useState<AoDaiProduct[]>([]);
  const [originalProducts, setOriginalProducts] = useState<AoDaiProduct[]>([]);

  React.useEffect(() => {
    async function fetchProducts() {
      const response = await fetch('/api/products/ao-dai-co-dau');
      const data = await response.json();
      setProducts(data);
      setOriginalProducts(data);
    }
    fetchProducts();
  }, []);

  const toggleFilter = (category: FilterCategory) => {
    if (expandedFilters.includes(category)) {
      setExpandedFilters(expandedFilters.filter(f => f !== category));
    } else {
      setExpandedFilters([...expandedFilters, category]);
    }
  };

  const toggleMobileFilter = () => {
    setMobileFilterOpen(!mobileFilterOpen);
  };

  const filterProducts = () => {
    if (!products || !Array.isArray(products)) {
      return [];
    }
    
    let filtered = products.filter(dress => {
      if (selectedColor && dress.color !== selectedColor) return false;

      if (dress.price < priceRange[0] || dress.price > priceRange[1]) return false;

      return true;
    });

    // Apply sorting with proper null checks
    return [...filtered].sort((a, b) => {
      if (!a || !b) return 0;
      
      switch (sortOrder) {
        case 'price-asc':
          return (a.price || 0) - (b.price || 0);
        case 'price-desc':
          return (b.price || 0) - (a.price || 0);
        case 'newest':
          // Handle null/undefined dates by converting to 0
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        default: // 'featured'
          return 0;
      }
    });
  };

  const filteredProducts = filterProducts();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-8">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link href="/" className="text-gray-700 hover:text-gray-900">
                Trang chủ
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <Link href="/collections" className="text-gray-700 hover:text-gray-900">
                  Danh mục
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-gray-500">Áo dài cô dâu</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-light text-center">ÁO DÀI CÔ DÂU</h1>
      </div>

      {/* Mobile filter button */}
      <div className="md:hidden mb-6">
        <Button
          variant="outline"
          className="w-full flex items-center justify-between"
          onClick={toggleMobileFilter}
        >
          <span className="flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Bộ lọc sản phẩm
          </span>
          {mobileFilterOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters sidebar */}
        <div className={`md:w-1/4 ${mobileFilterOpen ? 'block' : 'hidden md:block'}`}>
          <div className="border border-gray-200 p-4 rounded-md">
            <h2 className="font-medium text-lg mb-4">Lọc sản phẩm</h2>

            {/* Color filter */}
            <div className="mb-4">
              <div
                className="flex items-center justify-between cursor-pointer py-2"
                onClick={() => toggleFilter('color')}
              >
                <h3 className="font-medium">Màu sắc</h3>
                {expandedFilters.includes('color') ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </div>
              {expandedFilters.includes('color') && (
                <div className="pl-2 mt-2 space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="color-red"
                      className="mr-2"
                      checked={selectedColor === 'red'}
                      onChange={() => setSelectedColor(selectedColor === 'red' ? null : 'red')}
                    />
                    <label htmlFor="color-red" className="flex items-center">
                      <span className="w-4 h-4 rounded-full bg-red-600 mr-2"></span>
                      Đỏ
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="color-pink"
                      className="mr-2"
                      checked={selectedColor === 'pink'}
                      onChange={() => setSelectedColor(selectedColor === 'pink' ? null : 'pink')}
                    />
                    <label htmlFor="color-pink" className="flex items-center">
                      <span className="w-4 h-4 rounded-full bg-pink-400 mr-2"></span>
                      Hồng
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="color-white"
                      className="mr-2"
                      checked={selectedColor === 'white'}
                      onChange={() => setSelectedColor(selectedColor === 'white' ? null : 'white')}
                    />
                    <label htmlFor="color-white" className="flex items-center">
                      <span className="w-4 h-4 rounded-full  mr-2"></span>
                      Trắng
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Price filter */}
            <div>
              <div
                className="flex items-center justify-between cursor-pointer py-2"
                onClick={() => toggleFilter('price')}
              >
                <h3 className="font-medium">Giá</h3>
                {expandedFilters.includes('price') ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </div>
              {expandedFilters.includes('price') && (
                <div className="pl-2 mt-2 space-y-2">
                  <div className="flex items-center">
                    <input
                      type="range"
                      min="500000"
                      max="8000000"
                      step="500000"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                      className="w-full"
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{priceRange[0].toLocaleString('vi-VN')}₫</span>
                    <span>{priceRange[1].toLocaleString('vi-VN')}₫</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Products grid */}
        <div className="md:w-3/4">
          <div className="flex justify-between items-center mb-6">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm áo dài..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  onChange={(e) => {
                    const searchTerm = e.target.value.toLowerCase();
                    if (searchTerm === '') {
                      setProducts(originalProducts);
                    } else {
                      setProducts(originalProducts.filter(product => 
                        product.name.toLowerCase().includes(searchTerm)
                      ));
                    }
                  }}
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sắp xếp theo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Mặc định</SelectItem>
                <SelectItem value="price-asc">Giá: Thấp đến cao</SelectItem>
                <SelectItem value="price-desc">Giá: Cao đến thấp</SelectItem>
                <SelectItem value="newest">Mới nhất</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((dress) => (
              <Link key={dress.id} href={`/products/${dress.slug}`}>
                <div className="group relative">
                  <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                    <Image
                      src={dress.images[0]?.url || '/placeholder.jpg'}
                      alt={dress.name}
                      width={500}
                      height={600}
                      className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                    />
                  </div>
                  <div className="mt-4 flex justify-between">
                    <div>
                      <h3 className="text-sm text-gray-700">{dress.name}</h3>
                      <p className="mt-1 text-sm text-gray-500">{dress.color}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {dress.price.toLocaleString('vi-VN')}₫
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AoDaiCollection;
