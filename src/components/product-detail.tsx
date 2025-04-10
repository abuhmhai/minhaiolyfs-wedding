'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// This would typically come from a CMS or API
const sampleProduct = {
  id: '1',
  name: 'AMARIS - VLTX-734 LUXURY BALL GOWN OFFWHITE STRAIGHT ACROSS CHAPLE TRAIN SIMPLE',
  price: '18,000,000₫',
  images: [
    'https://ext.same-assets.com/44608533/4261772681.png',
    'https://ext.same-assets.com/2255830086/3054613867.jpeg',
    'https://ext.same-assets.com/2255830086/402582949.jpeg',
    'https://ext.same-assets.com/2255830086/2753547030.jpeg',
    'https://ext.same-assets.com/2255830086/99155218.jpeg',
  ],
  details: {
    color: 'OFFWHITE',
    style: 'BALL GOWN',
    size: 'S',
    material: 'Crepe',
    neckline: 'Cúp ngực ngang',
    sleeves: '',
    trainLength: '90 cm',
    back: 'Thắt dây',
    suitableFor: 'Làm lễ, chụp studio..',
  },
  description: 'Váy cưới cao cấp dáng chữ A chất liệu vải ren và lụa cao cấp, thiết kế tinh xảo, phù hợp cho các cô dâu lựa chọn khi chuẩn bị cho buổi lễ cưới.',
};

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

export default function ProductDetail({ slug }: { slug: string }) {
  const [mainImage, setMainImage] = useState(sampleProduct.images[0]);
  const [quantity, setQuantity] = useState(1);

  const handleThumbnailClick = (image: string) => {
    setMainImage(image);
  };

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
                <Link href="/collections/ao-cuoi" className="text-gray-700 hover:text-gray-900">
                  Áo cưới
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-gray-500 truncate max-w-[250px]">{sampleProduct.name}</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      {/* Product layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Product images */}
        <div>
          <div className="mb-4 relative overflow-hidden">
            <Image
              src={mainImage}
              alt={sampleProduct.name}
              width={800}
              height={1000}
              className="w-full h-auto object-cover"
            />
          </div>
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {sampleProduct.images.map((image, i) => (
              <div
                key={`image-${i}-${image.substring(image.lastIndexOf('/') + 1, image.lastIndexOf('.'))}`}
                onClick={() => handleThumbnailClick(image)}
                className={`cursor-pointer border-2 ${
                  mainImage === image ? 'border-gray-800' : 'border-transparent'
                }`}
              >
                <Image
                  src={image}
                  alt={`Thumbnail ${i + 1}`}
                  width={100}
                  height={120}
                  className="w-20 h-24 object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product details */}
        <div>
          <h1 className="text-2xl font-medium mb-4">{sampleProduct.name}</h1>
          <p className="text-xl text-gray-800 mb-6">{sampleProduct.price}</p>

          <div className="mb-6">
            <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
              Màu sắc
            </label>
            <select
              id="color"
              className="w-full border border-gray-300 rounded-sm p-2 focus:outline-none focus:ring-1 focus:ring-gray-500"
            >
              <option>OFFWHITE</option>
            </select>
          </div>

          <div className="mb-6">
            <p className="block text-sm font-medium text-gray-700 mb-1">Phân loại</p>
            <div className="flex space-x-2">
              <button className="bg-gray-100 border border-gray-300 px-4 py-2 text-sm font-medium">
                Thuê
              </button>
              <button className="bg-white border border-gray-300 px-4 py-2 text-sm font-medium">
                Bán
              </button>
              <button className="bg-white border border-gray-300 px-4 py-2 text-sm font-medium">
                May
              </button>
            </div>
          </div>

          <div className="mb-6">
            <p className="block text-sm font-medium text-gray-700 mb-1">Kiểu dáng</p>
            <div className="flex space-x-2">
              <button className="bg-gray-100 border border-gray-300 px-4 py-2 text-sm font-medium">
                full set
              </button>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm text-blue-600 underline cursor-pointer">
              Fit & Sizing Guide
            </p>
          </div>

          <div className="mb-6 flex items-center">
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mr-4">
              Số lượng
            </label>
            <input
              type="number"
              id="quantity"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-16 border border-gray-300 rounded-sm p-2 focus:outline-none focus:ring-1 focus:ring-gray-500"
            />
          </div>

          <div className="flex space-x-4 mb-8">
            <Button className="bg-amber-800 hover:bg-amber-900 text-white px-6 py-2">
              LIÊN HỆ QUA FANPAGE
            </Button>
            <Button variant="outline" className="px-6 py-2 border-amber-800 text-amber-800 hover:bg-amber-50">
              LIÊN HỆ QUA HOTLINE
            </Button>
          </div>

          <Button variant="outline" className="w-full py-2 mb-6 border-amber-800 text-amber-800 hover:bg-amber-50">
            REVIEW TỪ KHÁCH HÀNG
          </Button>

          <Button variant="outline" className="w-full py-2 mb-6 border-gray-300 text-gray-700">
            HẾT HÀNG
          </Button>

          {/* Share buttons */}
          <div className="mt-8">
            <h3 className="text-sm font-medium mb-2">Share this:</h3>
            <div className="flex space-x-2">
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

      {/* Product tabs */}
      <div className="mt-16">
        <Tabs defaultValue="description">
          <TabsList className="w-full border-b border-gray-200 mb-6">
            <TabsTrigger value="description" className="px-6 py-2">Mô tả sản phẩm</TabsTrigger>
            <TabsTrigger value="sizing" className="px-6 py-2">Hướng dẫn chọn size</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="px-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="mb-4">{sampleProduct.description}</p>
                <p className="mb-4 font-medium">Thông tin chi tiết:</p>
                <ul className="space-y-2">
                  <li><span className="font-medium">Giá thuê váy:</span> {sampleProduct.price}</li>
                  <li><span className="font-medium">Giá bán váy có sẵn:</span> VND</li>
                  <li><span className="font-medium">Giá may:</span> VND</li>
                </ul>

                <div className="mt-6">
                  <p className="mb-2 font-medium">Thông số sản phẩm:</p>
                  <table className="w-full border-collapse">
                    <tbody>
                      {Object.entries(sampleProduct.details).map(([key, value]) => (
                        <tr key={key} className="border-b border-gray-200">
                          <td className="py-2 pr-4 font-medium capitalize">{key === 'trainLength' ? 'Chiều dài đuôi' : key === 'suitableFor' ? 'Phù hợp sử dụng' : key}</td>
                          <td className="py-2">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div>
                <p className="mb-4 font-medium">Lưu ý:</p>
                <p className="mb-4"><strong>Trong trường hợp mua váy có sẵn</strong></p>
                <ul className="list-disc pl-5 space-y-2 mb-6">
                  <li>NHUNGTRANG có thể hỗ trợ khách điều chỉnh số đo nhỏ lên lai, bóp eo...(áp dụng với các sản phẩm có thể điều chỉnh được)</li>
                  <li>Thời gian hoàn tất: 15 -20 ngày kể từ ngày NHUNGTRANG xác nhận đơn hàng. Trong trường hợp khách hàng cần gấp hơn, vui lòng báo cho bộ phận tư vấn để ưu tiên sắp xếp đơn hàng</li>
                  <li>Giá bán không bao gồm phụ kiện nếu có (veil, bao tay, trang sức...)</li>
                </ul>
                <p className="mb-4"><strong>Trong trường hợp thuê váy:</strong> Thời gian giữ váy trong 1 lần thuê là 3 ngày.</p>
                <p className="mb-4"><strong>Trong trường hợp may mới theo số đo:</strong> nếu có điều chỉnh 1 số chi tiết, phụ thu thêm từ 500,000 - 2,000,000 so với giá may.</p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="sizing" className="px-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium mb-4">Hướng dẫn chọn size váy cưới</h3>
                <p className="mb-4">Để chiếc áo được may vừa vặn với cơ thể bạn, bạn nên lưu ý những yếu tố sau:</p>
                <ul className="list-disc pl-5 space-y-2 mb-6">
                  <li>Khi đo vòng ngực, nên mặc áo ngực và tay phải thả lỏng.</li>
                  <li>Khi đo vòng eo, phải đo nơi nhỏ nhất của vòng eo (thường nằm trên rốn 2.5 cm).</li>
                  <li>Khi đo vòng mông phải đo phần cao nhất của vòng mông, với thước bám sát xương hông.</li>
                </ul>
                <p className="mb-4">Đối với các loại áo có cổ thì phải đo thêm vòng cổ.</p>
                <p>Ngoài ra lưu ý cung cấp thêm những thông tin sau đây:</p>
                <ul className="list-disc pl-5 space-y-2 mb-6">
                  <li>Chiều dài của áo, đuôi áo dài bao nhiêu, độ phồng, độ dài, có tùng hay không tùng</li>
                  <li>Cung cấp chiều cao của đôi giày bạn muốn mang.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-4">Bảng size chuẩn</h3>
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2">Size</th>
                      <th className="border border-gray-300 px-4 py-2">Vòng ngực (cm)</th>
                      <th className="border border-gray-300 px-4 py-2">Vòng eo (cm)</th>
                      <th className="border border-gray-300 px-4 py-2">Vòng mông (cm)</th>
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
        <h2 className="text-2xl font-light text-center mb-8">Sản phẩm liên quan</h2>
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
