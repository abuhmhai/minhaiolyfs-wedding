'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';

const weddingDresses = [
  {
    id: '1',
    name: 'AMARIS - VLTX-734 LUXURY BALL GOWN OFFWHITE STRAIGHT ACROSS CHAPLE TRAIN SIMPLE',
    price: '18,000,000₫',
    image: 'https://ext.same-assets.com/44608533/4261772681.png',
    slug: 'amaris-vltx-734-luxury-ball-gown-offwhite-minimalist-straight-across-chaple-train-simple',
    category: 'ball-gown',
    color: 'offwhite',
  },
  {
    id: '2',
    name: 'VALORA - VPFA-742 PREMIUM NUDE BALL GOWN IVORY GODDESS COURT TRAIN LACE',
    price: '15,000,000₫',
    image: 'https://ext.same-assets.com/44608533/3972856577.png',
    slug: 'valora-vpfa-742-premium-nude-ball-gown-ivory-goddess-court-train-lace',
    category: 'ball-gown',
    color: 'ivory',
  },
  {
    id: '3',
    name: 'MIRABELLA - VPFA-741 PREMIUM A-LINE OFFWHITE BLING & GLAM SWEEP TRAIN HEAVY BEADED',
    price: '15,000,000₫',
    image: 'https://ext.same-assets.com/44608533/1470023077.png',
    slug: 'mirabella-vpfa-741-premium-a-line-offwhite-bling-glam-sweep-train-heavy-beaded',
    category: 'a-line',
    color: 'offwhite',
  },
  {
    id: '4',
    name: 'ROSELLE - VLTX-739 LUXURY BALL GOWN OFFWHITE FLORAL SPAGHETTI STRAP COURT TRAIN FLORAL LACE',
    price: '20,000,000₫',
    image: 'https://ext.same-assets.com/44608533/3092527618.png',
    slug: 'roselle-vltx-739-luxury-ball-gown-offwhite-floral-spaghetti-strap-court-train-floral-lace',
    category: 'ball-gown',
    color: 'offwhite',
  },
  {
    id: '5',
    name: 'EVELYN - VPFA-737 PREMIUM A-LINE OFFWHITE ELEGANT OFF-SHOUDER FLOOR LENGTH SIMPLE',
    price: '15,000,000₫',
    image: 'https://ext.same-assets.com/44608533/3671199880.png',
    slug: 'evelyn-vpfa-737-premium-a-line-offwhite-elegant-off-shouder-floor-length-simple',
    category: 'a-line',
    color: 'offwhite',
  },
  {
    id: '6',
    name: 'ALINA - VPFA-738 PREMIUM A-LINE IVORY ELEGANT SPAGHETTI STRAP FLOOR LENGTH FLORAL LACE',
    price: '15,000,000₫',
    image: 'https://ext.same-assets.com/44608533/3386758913.png',
    slug: 'alina-vpfa-738-premium-a-line-ivory-elegant-spaghetti-strap-floor-length-floral-lace',
    category: 'a-line',
    color: 'ivory',
  },
  {
    id: '7',
    name: 'ADRIENNE - VPDC-735 PREMIUM MERMAID IVORY STRAIGHT ACROSS SWEEP TRAIN',
    price: '15,000,000₫',
    image: 'https://ext.same-assets.com/44608533/1314628157.png',
    slug: 'adrienne-vpdc-735-premium-mermaid-ivory-straight-across-sweep-train',
    category: 'mermaid',
    color: 'ivory',
  },
  {
    id: '8',
    name: 'NIVARA - VPDC-736 PREMIUM A-LINE NUDE ELEGANT STRAIGHT ACROSS SWEEP TRAIN FLORAL LACE',
    price: '15,000,000₫',
    image: 'https://ext.same-assets.com/44608533/320492878.png',
    slug: 'nivara-vpdc-736-premium-a-line-nude-elegant-straight-across-sweep-train-floral-lace',
    category: 'a-line',
    color: 'nude',
  },
];

type FilterCategory = 'style' | 'color' | 'price';

const AoCuoiCollection = () => {
  const [expandedFilters, setExpandedFilters] = useState<FilterCategory[]>(['style', 'color', 'price']);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([500000, 80000000]);

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
    return weddingDresses.filter(dress => {
      if (selectedStyle && dress.category !== selectedStyle) return false;
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
                <span className="text-gray-500">Áo cưới</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-light text-center">ÁO CƯỚI</h1>
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

            {/* Style filter */}
            <div className="mb-4">
              <div
                className="flex items-center justify-between cursor-pointer py-2"
                onClick={() => toggleFilter('style')}
              >
                <h3 className="font-medium">Kiểu dáng</h3>
                {expandedFilters.includes('style') ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </div>
              {expandedFilters.includes('style') && (
                <div className="pl-2 mt-2 space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="style-ball-gown"
                      className="mr-2"
                      checked={selectedStyle === 'ball-gown'}
                      onChange={() => setSelectedStyle(selectedStyle === 'ball-gown' ? null : 'ball-gown')}
                    />
                    <label htmlFor="style-ball-gown">Dáng xòe/Ballgown</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="style-a-line"
                      className="mr-2"
                      checked={selectedStyle === 'a-line'}
                      onChange={() => setSelectedStyle(selectedStyle === 'a-line' ? null : 'a-line')}
                    />
                    <label htmlFor="style-a-line">Dáng chữ A</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="style-mermaid"
                      className="mr-2"
                      checked={selectedStyle === 'mermaid'}
                      onChange={() => setSelectedStyle(selectedStyle === 'mermaid' ? null : 'mermaid')}
                    />
                    <label htmlFor="style-mermaid">Dáng đuôi cá/Mermaid</label>
                  </div>
                </div>
              )}
            </div>

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
                      id="color-offwhite"
                      className="mr-2"
                      checked={selectedColor === 'offwhite'}
                      onChange={() => setSelectedColor(selectedColor === 'offwhite' ? null : 'offwhite')}
                    />
                    <label htmlFor="color-offwhite">Offwhite</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="color-ivory"
                      className="mr-2"
                      checked={selectedColor === 'ivory'}
                      onChange={() => setSelectedColor(selectedColor === 'ivory' ? null : 'ivory')}
                    />
                    <label htmlFor="color-ivory">Ivory</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="color-nude"
                      className="mr-2"
                      checked={selectedColor === 'nude'}
                      onChange={() => setSelectedColor(selectedColor === 'nude' ? null : 'nude')}
                    />
                    <label htmlFor="color-nude">Nude</label>
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
                    max="80000000"
                    step="1000000"
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
                setSelectedStyle(null);
                setSelectedColor(null);
                setPriceRange([500000, 80000000]);
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
                  setSelectedStyle(null);
                  setSelectedColor(null);
                  setPriceRange([500000, 80000000]);
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
              <Link href="/collections/ao-cuoi?page=2" className="px-3 py-2 border border-gray-300 hover:bg-gray-50">2</Link>
              <Link href="/collections/ao-cuoi?page=3" className="px-3 py-2 border border-gray-300 hover:bg-gray-50">3</Link>
              <Link href="/collections/ao-cuoi?page=4" className="px-3 py-2 border border-gray-300 hover:bg-gray-50">4</Link>
              <Link href="/collections/ao-cuoi?page=2" className="ml-2 px-3 py-2 border border-gray-300 hover:bg-gray-50">
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

export default AoCuoiCollection;
