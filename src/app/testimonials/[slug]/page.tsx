import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface TestimonialPageProps {
  params: {
    slug: string;
  };
}

export default async function TestimonialPage({ params }: TestimonialPageProps) {
  const testimonial = await prisma.blog.findUnique({
    where: { slug: params.slug },
    include: {
      author: true,
    },
  });

  if (!testimonial) {
    notFound();
  }

  // Format the date
  const date = new Date(testimonial.createdAt);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm">
          <li>
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              Trang chủ
            </Link>
          </li>
          <li className="text-gray-400">/</li>
          <li>
            <Link href="/testimonials" className="text-gray-600 hover:text-gray-900">
              Cảm nhận khách hàng
            </Link>
          </li>
          <li className="text-gray-400">/</li>
          <li className="text-gray-900 truncate max-w-[200px]">
            {testimonial.title}
          </li>
        </ol>
      </nav>

      {/* Hero Section */}
      <div className="relative h-[70vh] mb-12 rounded-lg overflow-hidden">
        <Image
          src={testimonial.image || '/placeholder.jpg'}
          alt={testimonial.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute top-8 left-8 bg-white/90 backdrop-blur-sm px-6 py-4 rounded-lg">
          <div className="text-5xl font-light">{day}</div>
          <div className="text-xl uppercase">{month}</div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-light mb-8 text-center">
          {testimonial.title}
        </h1>

        <div className="prose prose-lg mx-auto">
          <div className="mb-8 text-center text-gray-600">
            Chia sẻ bởi {testimonial.author.fullName}
          </div>
          
          <div className="whitespace-pre-wrap">
            {testimonial.content}
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-16 flex justify-between items-center">
          <Link
            href="/testimonials"
            className="inline-flex items-center text-amber-800 hover:text-amber-900"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Quay lại tất cả cảm nhận
          </Link>
        </div>
      </div>
    </div>
  );
} 