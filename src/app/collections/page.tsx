import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Collections = () => {
  // Sample collections data
  const collections = [
    {
      id: 1,
      name: "Do you see you? - Fall Collection 2025",
      slug: "do-you-see-you-fall-collection-2025",
      image: "https://ext.same-assets.com/817293358/417891985.jpeg"
    },
    {
      id: 2,
      name: "When The Clasic Meets Contemporary 2025",
      slug: "when-the-clasic-meets-contemporary",
      image: "https://ext.same-assets.com/817293358/2340185874.jpeg"
    },
    {
      id: 3,
      name: "Chạm Fall Collection",
      slug: "cham-fall-collection",
      image: "https://ext.same-assets.com/3216405869/3014493778.png"
    },
    {
      id: 4,
      name: "Majestic Splendor 2024",
      slug: "majestic-splendor-2024",
      image: "https://ext.same-assets.com/3216405869/2241857545.png"
    },
    {
      id: 5,
      name: "Into The Garden - Spring 2023",
      slug: "into-the-garden",
      image: "https://ext.same-assets.com/3216405869/1335644271.png"
    },
    {
      id: 6,
      name: "The ICONIC 1950s",
      slug: "the-iconic-1950s-12",
      image: "https://ext.same-assets.com/2255830086/3386047601.jpeg"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
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
                <span className="text-gray-500">Danh mục</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      <h1 className="text-3xl font-light text-center mb-10">BỘ SƯU TẬP</h1>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {collections.map((collection) => (
          <Link
            href={`/collections/${collection.slug}`}
            key={collection.id}
            className="group"
          >
            <div className="relative overflow-hidden">
              <Image
                src={collection.image}
                alt={collection.name}
                width={500}
                height={600}
                className="w-full h-[350px] object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="text-white text-center px-4">
                  <span className="font-medium">Xem bộ sưu tập</span>
                </div>
              </div>
            </div>
            <h3 className="mt-4 text-center text-lg font-medium">{collection.name}</h3>
          </Link>
        ))}
      </div>

      {/* Message */}
      <div className="mt-16 text-center">
        <h3 className="text-2xl font-light mb-4">Our business is memory making</h3>
        <div className="w-24 h-1 bg-gray-300 mx-auto" />
      </div>
    </div>
  );
};

export default Collections;
