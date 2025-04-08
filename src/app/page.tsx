import Image from 'next/image';
import Link from 'next/link';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Carousel */}
      <section className="relative">
        <Carousel className="w-full">
          <CarouselContent>
            <CarouselItem>
              <div className="relative h-[70vh] w-full">
                <Image
                  src="https://ext.same-assets.com/817293358/417891985.jpeg"
                  alt="NHUNGTRANG Wedding Collection"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <h1 className="text-4xl md:text-6xl font-light mb-4">When THE CLASSIC</h1>
                    <p className="text-3xl md:text-5xl font-light italic">Meets CONTEMPORARY</p>
                  </div>
                </div>
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className="relative h-[70vh] w-full">
                <Image
                  src="https://ext.same-assets.com/817293358/2340185874.jpeg"
                  alt="NHUNGTRANG Wedding Collection"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <h1 className="text-4xl md:text-6xl font-light mb-4">DO YOU SEE YOU?</h1>
                    <p className="text-3xl md:text-5xl font-light italic">FALL COLLECTION 2025</p>
                  </div>
                </div>
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
      </section>

      {/* Collection Banner */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl text-center font-light mb-8">DO YOU SEE YOU? - FALL COLLECTION 2025</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Example Product Cards - First Row */}
            <div className="group">
              <div className="relative overflow-hidden">
                <Image
                  src="https://ext.same-assets.com/44608533/4261772681.png"
                  alt="Wedding Dress"
                  width={400}
                  height={600}
                  className="w-full h-auto object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="mt-4 text-center">
                <h3 className="text-sm font-medium">AMARIS - VLTX-734 LUXURY BALL GOWN OFFWHITE STRAIGHT ACROSS CHAPLE TRAIN SIMPLE</h3>
                <p className="mt-1 text-gray-700">18,000,000₫</p>
              </div>
            </div>

            <div className="group">
              <div className="relative overflow-hidden">
                <Image
                  src="https://ext.same-assets.com/44608533/3972856577.png"
                  alt="Wedding Dress"
                  width={400}
                  height={600}
                  className="w-full h-auto object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="mt-4 text-center">
                <h3 className="text-sm font-medium">VALORA - VPFA-742 PREMIUM NUDE BALL GOWN IVORY GODDESS COURT TRAIN LACE</h3>
                <p className="mt-1 text-gray-700">15,000,000₫</p>
              </div>
            </div>

            <div className="group">
              <div className="relative overflow-hidden">
                <Image
                  src="https://ext.same-assets.com/44608533/1470023077.png"
                  alt="Wedding Dress"
                  width={400}
                  height={600}
                  className="w-full h-auto object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="mt-4 text-center">
                <h3 className="text-sm font-medium">MIRABELLA - VPFA-741 PREMIUM A-LINE OFFWHITE BLING & GLAM SWEEP TRAIN HEAVY BEADED</h3>
                <p className="mt-1 text-gray-700">15,000,000₫</p>
              </div>
            </div>
          </div>
          <div className="text-center mt-8">
            <Link href="/collections/ao-cuoi">
              <Button variant="outline" className="border-gray-300 hover:bg-gray-100">
                EXPLORE MORE
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Category 1 */}
            <div className="group relative overflow-hidden">
              <Image
                src="https://ext.same-assets.com/3216405869/3014493778.png"
                alt="BST Váy cưới"
                width={400}
                height={500}
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity">
                <h3 className="text-white text-xl font-medium mb-2">BST Váy cưới</h3>
                <Link href="/collections/ao-cuoi">
                  <span className="text-white text-sm underline">NHUNGTRANG WEDDING DRESSES &gt;&gt;</span>
                </Link>
              </div>
            </div>

            {/* Category 2 */}
            <div className="group relative overflow-hidden">
              <Image
                src="https://ext.same-assets.com/3216405869/2241857545.png"
                alt="BST Veil"
                width={400}
                height={500}
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity">
                <h3 className="text-white text-xl font-medium mb-2">BST Veil</h3>
                <Link href="/collections/veil">
                  <span className="text-white text-sm underline">NHUNGTRANG WEDDING VEIL &gt;&gt;</span>
                </Link>
              </div>
            </div>

            {/* Category 3 */}
            <div className="group relative overflow-hidden">
              <Image
                src="https://ext.same-assets.com/3216405869/1335644271.png"
                alt="BST Áo dài"
                width={400}
                height={500}
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity">
                <h3 className="text-white text-xl font-medium mb-2">BST Áo dài</h3>
                <Link href="/collections/ao-dai-co-dau">
                  <span className="text-white text-sm underline">NHUNGTRANG AO DAI &gt;&gt;</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real Bridal Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl text-center font-light mb-8">REAL BRIDAL</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Real Bridal Images */}
            <div className="group relative overflow-hidden">
              <Image
                src="https://ext.same-assets.com/2255830086/3386047601.jpeg"
                alt="Real Bridal"
                width={300}
                height={400}
                className="w-full h-auto object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <div className="group relative overflow-hidden">
              <Image
                src="https://ext.same-assets.com/2255830086/1738353443.jpeg"
                alt="Real Bridal"
                width={300}
                height={400}
                className="w-full h-auto object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <div className="group relative overflow-hidden">
              <Image
                src="https://ext.same-assets.com/2255830086/3352709945.jpeg"
                alt="Real Bridal"
                width={300}
                height={400}
                className="w-full h-auto object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <div className="group relative overflow-hidden">
              <Image
                src="https://ext.same-assets.com/2255830086/2294901368.jpeg"
                alt="Real Bridal"
                width={300}
                height={400}
                className="w-full h-auto object-cover transition-transform group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-light mb-8">#INSTAGRAM</h2>
          <p className="text-gray-600 mb-6">Share your <strong>#nhungtrangbridal</strong> style for a change to be</p>
          <div className="flex justify-center space-x-4">
            <Link href="/blogs/testimonials">
              <Button className="bg-rose-500 hover:bg-rose-600 text-white">
                TESTIMONIALS
              </Button>
            </Link>
            <Link href="/blogs/news">
              <Button variant="outline" className="border-rose-500 text-rose-500 hover:bg-rose-50">
                THE BLOG
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Memory Making Section */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-light mb-4">Our business is memory making</h3>
          <div className="w-24 h-1 bg-gray-300 mx-auto" />
        </div>
      </section>
    </div>
  );
}
