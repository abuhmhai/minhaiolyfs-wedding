'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Product } from '@prisma/client';
import RentalDatePicker from './RentalDatePicker';
import { useCart } from '@/hooks/useCart';
import { toast } from 'sonner';

interface ProductDetailClientProps {
  product: Product & {
    images: { url: string }[];
    category: { name: string; slug: string };
    style?: string | null;
    color?: string | null;
  };
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [mainImage, setMainImage] = useState(product.images[0]?.url || '/placeholder.jpg');
  const [quantity, setQuantity] = useState(1);
  const [rentalStartDate, setRentalStartDate] = useState<Date | null>(null);
  const [rentalEndDate, setRentalEndDate] = useState<Date | null>(null);
  const [selectedColor, setSelectedColor] = useState(product.color || '');
  const [selectedStyle, setSelectedStyle] = useState(product.style || '');
  const { addItem } = useCart();
  const isWeddingDress = product.category.slug === 'ao-cuoi';
  const isAoDai = product.category.slug === 'ao-dai-co-dau';

  const handleThumbnailClick = (image: string) => {
    setMainImage(image);
  };

  const handleDatesSelected = (startDate: Date | null, endDate: Date | null) => {
    setRentalStartDate(startDate);
    setRentalEndDate(endDate);
  };

  const handleAddToCart = async () => {
    if (isWeddingDress && !rentalStartDate) {
      toast.error('Please select rental date');
      return;
    }

    if (product.stockQuantity < quantity) {
      toast.error('Insufficient product quantity');
      return;
    }

    if (!selectedColor) {
      toast.error('Please select color');
      return;
    }

    if (isWeddingDress && !selectedStyle) {
      toast.error('Please select style');
      return;
    }

    try {
      const transformedProduct = {
        ...product,
        images: product.images.map(img => ({
          id: 0,
          url: img.url
        }))
      };

      const cartItem = {
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0]?.url || '/placeholder.jpg',
        quantity: quantity,
        rentalStartDate: isWeddingDress ? rentalStartDate! : new Date(),
        rentalEndDate: isWeddingDress ? rentalStartDate! : new Date(),
        color: selectedColor,
        type: isWeddingDress ? 'rental' : 'purchase',
        style: selectedStyle,
        product: transformedProduct
      };

      await addItem(cartItem);
      toast.success('Added to cart');
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('login')) {
          toast.error('Please log in to add product to cart');
        } else {
          toast.error(error.message || 'Unable to add product to cart');
        }
      } else {
        toast.error('Unable to add product to cart');
      }
    }
  };

  const isOutOfStock = product.stockQuantity <= 0;
  const isLowStock = product.stockQuantity <= 5 && product.stockQuantity > 0;

  // Mock data for product details - replace with actual data from your database
  const productDetails = {
    color: product.color || 'OFFWHITE',
    style: product.style || product.category.name.toUpperCase(),
    size: 'S',
    material: 'Crepe',
    neckline: 'Cúp ngực ngang',
    sleeves: '',
    trainLength: '90 cm',
    back: 'Thắt dây',
    suitableFor: 'Làm lễ, chụp studio..',
  };

  // Mock data for related products - replace with actual data from your database
  const relatedProducts = [
    {
      id: '2',
      name: 'VALORA - VPFA-742 PREMIUM NUDE BALL GOWN IVORY GODDESS COURT TRAIN LACE',
      price: '15,000,000₫',
      image: 'https://ext.same-assets.com/44608533/3972856577.png',
      slug: 'valora-vpfa-742-premium-nude-ball-gown-ivory-goddess-court-train-lace',
    },
    {
      id: '3',
      name: 'MIRABELLA - VPFA-741 PREMIUM A-LINE OFFWHITE BLING & GLAM SWEEP TRAIN HEAVY BEADED',
      price: '15,000,000₫',
      image: 'https://ext.same-assets.com/44608533/1470023077.png',
      slug: 'mirabella-vpfa-741-premium-a-line-offwhite-bling-glam-sweep-train-heavy-beaded',
    },
    {
      id: '4',
      name: 'ROSELLE - VLTX-739 LUXURY BALL GOWN OFFWHITE FLORAL SPAGHETTI STRAP COURT TRAIN FLORAL LACE',
      price: '20,000,000₫',
      image: 'https://ext.same-assets.com/44608533/3092527618.png',
      slug: 'roselle-vltx-739-luxury-ball-gown-offwhite-floral-spaghetti-strap-court-train-floral-lace',
    },
  ];

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
                  Category
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <Link href="/collections/ao-dai-co-dau" className="text-gray-700 hover:text-gray-900">
                  Ao Dai
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-gray-500 truncate max-w-[250px]">{product.name}</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      {/* Product layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product images */}
        <div className="space-y-6">
          <div className="relative overflow-hidden rounded-lg">
            <Image
              src={mainImage}
              alt={product.name}
              width={800}
              height={1000}
              className="w-full h-auto object-cover"
            />
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {product.images.map((image, i) => (
              <div
                key={`image-${i}-${image.url.substring(image.url.lastIndexOf('/') + 1, image.url.lastIndexOf('.'))}`}
                onClick={() => handleThumbnailClick(image.url)}
                className={`cursor-pointer border-2 rounded-md ${
                  mainImage === image.url ? 'border-gray-800' : 'border-transparent'
                }`}
              >
                <Image
                  src={image.url}
                  alt={`Thumbnail ${i + 1}`}
                  width={100}
                  height={120}
                  className="w-20 h-24 object-cover rounded-md"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product details */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-3xl font-medium">{product.name}</h1>
            <p className="text-2xl text-gray-800">{product.price.toLocaleString('vi-VN')}₫</p>
            
            {/* Stock status */}
            <div className="flex items-center gap-2">
              {isOutOfStock ? (
                <span className="text-red-600 font-medium">Out of stock</span>
              ) : isLowStock ? (
                <span className="text-amber-600 font-medium">
                  Low stock (Only {product.stockQuantity} items left)
                </span>
              ) : null}
            </div>
          </div>

          <div className="space-y-6">
            {/* Rental Date Picker */}
            <RentalDatePicker
              onDatesSelected={handleDatesSelected}
              isDisabled={isOutOfStock || !isWeddingDress}
            />

            {rentalStartDate && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  Rental date: {rentalStartDate.toLocaleDateString('en-US')}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDatesSelected(null, null)}
                  className="text-xs"
                >
                  Clear
                </Button>
              </div>
            )}

            <div className="space-y-4">
              {isWeddingDress && (
                <div>
                  <p className="text-sm font-medium mb-2">Style</p>
                  <div className="flex flex-wrap gap-2">
                    <button 
                      type="button"
                      className={`px-6 py-2.5 text-sm font-medium rounded-md transition-colors ${
                        selectedStyle === 'dang-xoe-ballgown' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedStyle('dang-xoe-ballgown')}
                    >
                      Dáng xòe/Ballgown
                    </button>
                    <button 
                      type="button"
                      className={`px-6 py-2.5 text-sm font-medium rounded-md transition-colors ${
                        selectedStyle === 'dang-chu-a' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedStyle('dang-chu-a')}
                    >
                      Dáng chữ A
                    </button>
                    <button 
                      type="button"
                      className={`px-6 py-2.5 text-sm font-medium rounded-md transition-colors ${
                        selectedStyle === 'dang-duoi-ca-mermaid' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedStyle('dang-duoi-ca-mermaid')}
                    >
                      Dáng đuôi cá/Mermaid
                    </button>
                  </div>
                </div>
              )}

              <div>
                <p className="text-sm font-medium mb-2">Color</p>
                <div className="flex flex-wrap gap-2">
                  {isWeddingDress ? (
                    <>
                      <button 
                        type="button"
                        className={`px-6 py-2.5 text-sm font-medium rounded-md transition-colors ${
                          selectedColor === 'offwhite' 
                            ? 'bg-gray-100 text-gray-900' 
                            : 'bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedColor('offwhite')}
                      >
                        <span className="flex items-center">
                          <span className="w-4 h-4 rounded-full bg-gray-100 mr-2"></span>
                          Offwhite
                        </span>
                      </button>
                      <button 
                        type="button"
                        className={`px-6 py-2.5 text-sm font-medium rounded-md transition-colors ${
                          selectedColor === 'ivory' 
                            ? 'bg-amber-50 text-gray-900' 
                            : 'bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedColor('ivory')}
                      >
                        <span className="flex items-center">
                          <span className="w-4 h-4 rounded-full bg-amber-50 mr-2"></span>
                          Ivory
                        </span>
                      </button>
                      <button 
                        type="button"
                        className={`px-6 py-2.5 text-sm font-medium rounded-md transition-colors ${
                          selectedColor === 'nude' 
                            ? 'bg-amber-800 text-white' 
                            : 'bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedColor('nude')}
                      >
                        <span className="flex items-center">
                          <span className="w-4 h-4 rounded-full bg-amber-100 mr-2"></span>
                          Nude
                        </span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        type="button"
                        className={`px-6 py-2.5 text-sm font-medium rounded-md transition-colors ${
                          selectedColor === 'do' 
                            ? 'bg-red-600 text-white' 
                            : 'bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedColor('do')}
                      >
                        <span className="flex items-center">
                          <span className="w-4 h-4 rounded-full bg-red-600 mr-2"></span>
                          Đỏ
                        </span>
                      </button>
                      <button 
                        type="button"
                        className={`px-6 py-2.5 text-sm font-medium rounded-md transition-colors ${
                          selectedColor === 'hong' 
                            ? 'bg-pink-500 text-white' 
                            : 'bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedColor('hong')}
                      >
                        <span className="flex items-center">
                          <span className="w-4 h-4 rounded-full bg-pink-500 mr-2"></span>
                          Hồng
                        </span>
                      </button>
                      <button 
                        type="button"
                        className={`px-6 py-2.5 text-sm font-medium rounded-md transition-colors ${
                          selectedColor === 'trang' 
                            ? 'bg-white text-gray-900 border-2 border-gray-300' 
                            : 'bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedColor('trang')}
                      >
                        <span className="flex items-center">
                          <span className="w-4 h-4 rounded-full bg-white border border-gray-300 mr-2"></span>
                          Trắng
                        </span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            <p className="text-sm text-blue-600 underline cursor-pointer hover:text-blue-800">
              Fit & Sizing Guide
            </p>

            <div className="flex items-center gap-4">
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                Quantity
              </label>
              <input
                type="number"
                id="quantity"
                min="1"
                max={product.stockQuantity}
                value={quantity}
                onChange={(e) => setQuantity(Math.min(parseInt(e.target.value), product.stockQuantity))}
                className="w-20 border border-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-1 focus:ring-gray-500"
                disabled={isOutOfStock}
              />
            </div>

            <div className="flex gap-4">
              <Button
                className="flex-1 bg-amber-800 hover:bg-amber-900 text-white px-6 py-2.5 rounded-md transition-colors"
                onClick={handleAddToCart}
                disabled={isOutOfStock || 
                  (isWeddingDress && !rentalStartDate) || 
                  !selectedColor || 
                  (isWeddingDress && !selectedStyle)}
              >
                ADD TO CART
              </Button>
              <Button variant="outline" className="flex-1 px-6 py-2.5 border-amber-800 text-amber-800 hover:bg-amber-50 rounded-md transition-colors">
                CONTACT US
              </Button>
            </div>

            {/* Share buttons */}
            <div className="pt-4">
              <h3 className="text-sm font-medium mb-3">Share this:</h3>
              <div className="flex gap-3">
                <Link href="#" className="text-gray-600 hover:text-gray-900">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8.5 10V8C8.5 6.067 10.067 4.5 12 4.5C13.933 4.5 15.5 6.067 15.5 8V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 12L12 16L8 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 16V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
                <Link href="#" className="text-gray-600 hover:text-gray-900">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 2H14C12.6739 2 11.4021 2.52678 10.4645 3.46447C9.52678 4.40215 9 5.67392 9 7V10H6V14H9V22H13V14H16L17 10H13V7C13 6.73478 13.1054 6.48043 13.2929 6.29289C13.4804 6.10536 13.7348 6 14 6H17V2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
                <Link href="#" className="text-gray-600 hover:text-gray-900">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 4.01C21 4.5 20.02 4.87 19 5.09C18.46 4.5 17.73 4.11 16.93 3.94C16.13 3.78 15.3 3.85 14.54 4.16C13.78 4.47 13.12 5 12.66 5.7C12.2 6.4 11.96 7.22 12 8.04V9.04C10.43 9.08 8.87 8.73 7.47 8.04C6.06 7.35 4.84 6.32 3.92 5.01C3.92 5.01 0.921 12.77 8.92 16.14C7.08 17.38 4.94 18.07 2.92 18.01C10.92 22.35 20.92 18.01 20.92 8.01C20.92 7.71 20.88 7.41 20.82 7.11C21.9 6.01 22.63 4.61 22 4.01Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product tabs */}
      <div className="mt-16">
        <Tabs defaultValue="description">
          <TabsList className="w-full border-b border-gray-200 mb-6">
            <TabsTrigger value="description" className="px-6 py-2">Product Description</TabsTrigger>
            <TabsTrigger value="sizing" className="px-6 py-2">Size Guide</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="px-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="mb-4">{product.description}</p>
                <p className="mb-4 font-medium">Detailed Information:</p>
                <ul className="space-y-2">
                  <li><span className="font-medium">Rental price:</span> {product.price.toLocaleString('en-US')}₫</li>
                  <li><span className="font-medium">Ready-to-wear price:</span> VND</li>
                  <li><span className="font-medium">Custom-made price:</span> VND</li>
                </ul>

                <div className="mt-6">
                  <p className="mb-2 font-medium">Product Specifications:</p>
                  <table className="w-full border-collapse">
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <td className="py-2 pr-4 font-medium">Style</td>
                        <td className="py-2">{product.style || 'Not available'}</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-2 pr-4 font-medium">Color</td>
                        <td className="py-2">{product.color || 'Not available'}</td>
                      </tr>
                      {Object.entries(productDetails).map(([key, value]) => {
                        if (key !== 'style' && key !== 'color') {
                          return (
                            <tr key={key} className="border-b border-gray-200">
                              <td className="py-2 pr-4 font-medium capitalize">{key === 'trainLength' ? 'Tail Length' : key === 'suitableFor' ? 'Suitable For' : key}</td>
                              <td className="py-2">{value}</td>
                            </tr>
                          );
                        }
                        return null;
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              <div>
                <p className="mb-4 font-medium">Note:</p>
                <p className="mb-4"><strong>For ready-to-wear dresses</strong></p>
                <ul className="list-disc pl-5 space-y-2 mb-6">
                  <li>NHUNGTRANG can assist with minor adjustments like hemming, waist tightening...(applicable to adjustable products)</li>
                  <li>Completion time: 15-20 days from NHUNGTRANG's order confirmation. For urgent orders, please inform our consultants for priority arrangement</li>
                  <li>Price does not include accessories if any (veil, gloves, jewelry...)</li>
                </ul>
                <p className="mb-4"><strong>For dress rental:</strong> Rental duration is 3 days per rental.</p>
                <p className="mb-4"><strong>For custom-made dresses:</strong> Additional charges from 500,000 - 2,000,000 VND for any adjustments to the original design.</p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="sizing" className="px-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium mb-4">Size Guide</h3>
                <p className="mb-4">To ensure the dress fits your body, please consider the following factors:</p>
                <ul className="list-disc pl-5 space-y-2 mb-6">
                  <li>When measuring the bust, make sure to wear a tight-fitting bra.</li>
                  <li>When measuring the waist, measure the smallest part of the waist (usually around the waist 2.5 cm).</li>
                  <li>When measuring the hips, measure the highest part of the hips, with the tape sticking to the hip bone.</li>
                </ul>
                <p className="mb-4">For dresses with a collar, an additional collar measurement is required.</p>
                <p>Also, please provide the following additional information:</p>
                <ul className="list-disc pl-5 space-y-2 mb-6">
                  <li>Dress length, tail length, fullness, length, with or without lining</li>
                  <li>Provide the height of your shoe size.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-4">Standard Size Table</h3>
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2">Size</th>
                      <th className="border border-gray-300 px-4 py-2">Bust (cm)</th>
                      <th className="border border-gray-300 px-4 py-2">Waist (cm)</th>
                      <th className="border border-gray-300 px-4 py-2">Hips (cm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">XS</td>
                      <td className="border border-gray-300 px-4 py-2">76-80</td>
                      <td className="border border-gray-300 px-4 py-2">60-64</td>
                      <td className="border border-gray-300 px-4 py-2">86-90</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">S</td>
                      <td className="border border-gray-300 px-4 py-2">81-85</td>
                      <td className="border border-gray-300 px-4 py-2">65-69</td>
                      <td className="border border-gray-300 px-4 py-2">91-95</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">M</td>
                      <td className="border border-gray-300 px-4 py-2">86-90</td>
                      <td className="border border-gray-300 px-4 py-2">70-74</td>
                      <td className="border border-gray-300 px-4 py-2">96-100</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">L</td>
                      <td className="border border-gray-300 px-4 py-2">91-95</td>
                      <td className="border border-gray-300 px-4 py-2">75-79</td>
                      <td className="border border-gray-300 px-4 py-2">101-105</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">XL</td>
                      <td className="border border-gray-300 px-4 py-2">96-100</td>
                      <td className="border border-gray-300 px-4 py-2">80-84</td>
                      <td className="border border-gray-300 px-4 py-2">106-110</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related products */}
      <div className="mt-16">
        <h2 className="text-2xl font-light text-center mb-8">Related Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((product) => (
            <Link href={`/products/${product.slug}`} key={product.id} className="group">
              <div className="relative overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={300}
                  height={400}
                  className="w-full h-auto object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-medium text-center">{product.name}</h3>
                <p className="mt-1 text-gray-700 text-center">{product.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}