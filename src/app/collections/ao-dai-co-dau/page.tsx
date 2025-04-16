'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';

const aoDaiDresses = [
  {
    id: '1',
    name: 'THIÊN HƯƠNG - VLTX-1001 LUXURY ÁO DÀI CÔ DÂU ĐỎ THÊU HOA',
    price: '15,000,000₫',
    image: 'https://ext.same-assets.com/3216405869/thien-huong-vltx-1001.png',
    slug: 'thien-huong-vltx-1001-luxury-ao-dai-co-dau-do-theu-hoa',
    color: 'red',
  },
  {
    id: '2',
    name: 'NGỌC LAN - VPFA-1002 PREMIUM ÁO DÀI CÔ DÂU HỒNG THÊU RỒNG PHƯỢNG',
    price: '17,000,000₫',
    image: 'https://ext.same-assets.com/3216405869/ngoc-lan-vpfa-1002.png',
    slug: 'ngoc-lan-vpfa-1002-premium-ao-dai-co-dau-hong-theu-rong-phuong',
    color: 'pink',
  },
  {
    id: '3',
    name: 'THƯONG DUNG - ÁO DÀI CÔ DÂU ADCD - 226',
    price: '5,000,000₫',
    image: 'https://ext.same-assets.com/3216405869/3014493778.png',
    slug: 'thuong-dung-ao-dai-co-dau-adcd-226',
    color: 'red',
  },
  {
    id: '4',
    name: 'VÂN NHƯ - ÁO DÀI CÔ DÂU ADCD - 228',
    price: '4,500,000₫',
    image: 'https://ext.same-assets.com/3216405869/2241857545.png',
    slug: 'van-nhu-ao-dai-co-dau-adcd-228',
    color: 'pink',
  },
  {
    id: '5',
    name: 'KIỀU CHÂU - ÁO DÀI CÔ DÂU ADCD - 224',
    price: '4,500,000₫',
    image: 'https://ext.same-assets.com/3216405869/1335644271.png',
    slug: 'kieu-chau-ao-dai-co-dau-adcd-224',
    color: 'white',
  },
  {
    id: '6',
    name: 'NGỌC DAO - ÁO DÀI CÔ DÂU ADCD - 225',
    price: '4,000,000₫',
    image: 'https://ext.same-assets.com/3216405869/3014493778.png',
    slug: 'ngoc-dao-ao-dai-co-dau-adcd-225',
    color: 'white',
  },
  {
    id: '7',
    name: 'BẠCH LIÊN - ÁO DÀI CÔ DÂU ADCD - 231',
    price: '3,000,000₫',
    image: 'https://ext.same-assets.com/3216405869/4218051108.png',
    slug: 'bach-lien-ao-dai-co-dau-adcd-231',
    color: 'white',
  },
  {
    id: '8',
    name: 'ĐÔNG MAI - ÁO DÀI CÔ DÂU ADCD - 230',
    price: '3,000,000₫',
    image: 'https://ext.same-assets.com/3216405869/3014493778.png',
    slug: 'dong-mai-ao-dai-co-dau-adcd-230',
    color: 'red',
  },
  {
    id: '9',
    name: 'THANH TÂM - ÁO DÀI CÔ DÂU ADCD - 227',
    price: '3,000,000₫',
    image: 'https://ext.same-assets.com/3216405869/809727370.png',
    slug: 'thanh-tam-ao-dai-co-dau-adcd-227',
    color: 'white',
  },
  {
    id: '10',
    name: 'ÁO DÀI CÔ DÂU ADCD-220',
    price: '2,500,000₫',
    image: 'https://ext.same-assets.com/3216405869/2538418983.png',
    slug: 'ao-dai-co-dau-adcd-220',
    color: 'red',
  }
];

type FilterCategory = 'color' | 'price';

const AoDaiCollection = () => {
  const [expandedFilters, setExpandedFilters] = useState<FilterCategory[]>(['color', 'price']);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([500000, 8000000]);

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
    return aoDaiDresses.filter(dress => {
      if (selectedColor && dress.color !== selectedColor) return false;

      const price = parseInt(dress.price.replace(/[^0-9]/g, ''));
      if (price < priceRange[0] || price > priceRange[1]) return false;

      return true;
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
                    <label htmlFor="color-red">Đỏ</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="color-white"
                      className="mr-2"
                      checked={selectedColor === 'white'}
                      onChange={() => setSelectedColor(selectedColor === 'white' ? null : 'white')}
                    />
                    <label htmlFor="color-white">Trắng</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="color-pink"
                      className="mr-2"
                      checked={selectedColor === 'pink'}
                      onChange={() => setSelectedColor(selectedColor === 'pink' ? null : 'pink')}
                    />
                    <label htmlFor="color-pink">Hồng</label>
                  </div>
                </div>
              )}
            </div>

            {/* Price filter */}
            <div className="mb-4">
              <div
                className="flex items-center justify-between cursor-pointer py-2"
                onClick={() => toggleFilter('price')}
              >
                <h3 className="font-medium">Giá sản phẩm</h3>
                {expandedFilters.includes('price') ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </div>
              {expandedFilters.includes('price') && (
                <div className="pl-2 mt-2 space-y-4">
                  <div className="flex justify-between">
                    <span>{priceRange[0].toLocaleString()}₫</span>
                    <span>{priceRange[1].toLocaleString()}₫</span>
                  </div>
                  <input
                    type="range"
                    min="500000"
                    max="8000000"
                    step="500000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                </div>
              )}
            </div>

            {/* Clear filters button */}
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => {
                setSelectedColor(null);
                setPriceRange([500000, 8000000]);
              }}
            >
              Clear All
            </Button>
          </div>
        </div>

        {/* Products grid */}
        <div className="md:w-3/4">
          <div className="mb-6 flex justify-between items-center">
            <p className="text-gray-600">1 - {filteredProducts.length} of {filteredProducts.length} products</p>
            <select className="border border-gray-300 rounded-sm p-2 text-sm">
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Link href={`/products/${product.slug}`} key={product.id} className="group">
                <div className="relative overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={400}
                    height={600}
                    className="w-full h-auto object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="mt-4 text-center">
                  <h3 className="text-sm font-medium">{product.name}</h3>
                  <p className="mt-1 text-gray-700">{product.price}</p>
                </div>
              </Link>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">No products match your selected filters.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSelectedColor(null);
                  setPriceRange([500000, 8000000]);
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}

          {/* Pagination */}
          <div className="mt-10 flex justify-center">
            <nav className="inline-flex" aria-label="Pagination">
              <span className="px-3 py-2 border border-gray-300 bg-gray-100 text-gray-400">1</span>
              <Link href="/collections/ao-dai-co-dau?page=2" className="px-3 py-2 border border-gray-300 hover:bg-gray-50">2</Link>
              <Link href="/collections/ao-dai-co-dau?page=3" className="px-3 py-2 border border-gray-300 hover:bg-gray-50">3</Link>
              <Link href="/collections/ao-dai-co-dau?page=4" className="px-3 py-2 border border-gray-300 hover:bg-gray-50">4</Link>
              <Link href="/collections/ao-dai-co-dau?page=2" className="ml-2 px-3 py-2 border border-gray-300 hover:bg-gray-50">
                <span className="sr-only">Next</span>
                &rarr;
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Memory Making Section */}
      <div className="mt-16 text-center">
        <h3 className="text-2xl font-light mb-4">Our business is memory making</h3>
        <div className="w-24 h-1 bg-gray-300 mx-auto" />
      </div>
    </div>
  );
};

export default AoDaiCollection;
