'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Filter, Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type FilterCategory = 'style' | 'color' | 'price';

interface Product {
  id: string;
  name: string;
  price: number;
  images: { url: string }[];
  slug: string;
  category: {
    slug: string;
  };
  color: string;
  createdAt: string; // ISO date string
  style: string;
}

const AoCuoiCollection = () => {
  const [expandedFilters, setExpandedFilters] = useState<FilterCategory[]>(['style', 'color', 'price']);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([500000, 80000000]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<string>('featured');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      console.log('Fetching products...');
      const response = await fetch('/api/products?category=ao-cuoi');
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched products:', data);
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFilter = (category: FilterCategory) => {
    setExpandedFilters(prev =>
      prev.includes(category)
        ? prev.filter(item => item !== category)
        : [...prev, category]
    );
  };

  const toggleMobileFilter = () => {
    setMobileFilterOpen(!mobileFilterOpen);
  };

  const filterProducts = () => {
    console.log('Starting filtering with:', {
      selectedStyle,
      selectedColor,
      priceRange,
      totalProducts: products.length
    });

    let filtered = products.filter(product => {
      // Handle both string and enum style values
      if (selectedStyle) {
        const productStyle = product.style?.toUpperCase();
        console.log('Checking style:', {
          productName: product.name,
          productStyle,
          selectedStyle,
          matches: productStyle === selectedStyle
        });
        if (!productStyle || productStyle !== selectedStyle) return false;
      }
      if (selectedColor && product.color !== selectedColor) return false;
      if (product.price < priceRange[0] || product.price > priceRange[1]) return false;
      return true;
    });

    console.log('After filtering:', {
      filteredCount: filtered.length,
      firstProduct: filtered[0]
    });

    // Apply sorting with null checks
    return [...filtered].sort((a, b) => {
      if (!a || !b) return 0;
      
      switch (sortOrder) {
        case 'price-asc':
          return (a.price || 0) - (b.price || 0);
        case 'price-desc':
          return (b.price || 0) - (a.price || 0);
        case 'newest':
          // Sort by createdAt date, fallback to ID if no date
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        default: // 'featured'
          return 0;
      }
    });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredProducts = filterProducts().filter(product => 
    searchTerm === '' || product.name.toLowerCase().includes(searchTerm)
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-8">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link href="/" className="text-gray-700 hover:text-gray-900">
                Home
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <Link href="/collections" className="text-gray-700 hover:text-gray-900">
                  Categories
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-gray-500">Wedding Dresses</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-light text-center">WEDDING DRESSES</h1>
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
            Product Filters
          </span>
          {mobileFilterOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters sidebar */}
        <div className={`md:w-1/4 ${mobileFilterOpen ? 'block' : 'hidden md:block'}`}>
          <div className="border border-gray-200 p-4 rounded-md">
            <h2 className="font-medium text-lg mb-4">Filter Products            </h2>

            {/* Style filter */}
            <div className="mb-4">
              <div
                className="flex items-center justify-between cursor-pointer py-2"
                onClick={() => toggleFilter('style')}
              >
                <h3 className="font-medium">Style</h3>
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
                      checked={selectedStyle === 'DANG_XOE_BALLGOWN'}
                      onChange={() => setSelectedStyle(selectedStyle === 'DANG_XOE_BALLGOWN' ? null : 'DANG_XOE_BALLGOWN')}
                    />
                    <label htmlFor="style-ball-gown">Dáng xòe/Ballgown</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="style-a-line"
                      className="mr-2"
                      checked={selectedStyle === 'DANG_CHU_A'}
                      onChange={() => setSelectedStyle(selectedStyle === 'DANG_CHU_A' ? null : 'DANG_CHU_A')}
                    />
                    <label htmlFor="style-a-line">Dáng chữ A</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="style-mermaid"
                      className="mr-2"
                      checked={selectedStyle === 'DANG_DUOI_CA_MERMAID'}
                      onChange={() => setSelectedStyle(selectedStyle === 'DANG_DUOI_CA_MERMAID' ? null : 'DANG_DUOI_CA_MERMAID')}
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
                <h3 className="font-medium">Color</h3>
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
                <h3 className="font-medium">Price Range</h3>
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
              Clear All Filters
            </Button>
          </div>
        </div>

        {/* Products grid */}
        <div className="md:w-3/4">
          <div className="mb-6 flex justify-between items-center">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search wedding dresses..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Link href={`/products/${product.slug}`} key={product.id} className="group">
                <div className="relative overflow-hidden">
                  <Image
                    src={product.images[0].url}
                    alt={product.name}
                    width={400}
                    height={600}
                    className="w-full h-auto object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="mt-4 text-center">
                  <h3 className="text-sm font-medium">{product.name}</h3>
                  <p className="mt-1 text-gray-700">{product.price.toLocaleString()}₫</p>
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
