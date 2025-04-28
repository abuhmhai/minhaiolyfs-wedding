import { Metadata } from "next"
import Image from "next/image"
import { Star } from "lucide-react"

export const metadata: Metadata = {
  title: "Testimonials | Wedding Dress Rental",
  description: "Read the experiences of happy couples about their wedding dress rental experience.",
}

const testimonials = [
  {
    id: 1,
    name: "Sarah & Michael",
    date: "March, 2024",
    image: "/testimonials/couple1.png",
    rating: 5,
    content: "The quality of the rental items exceeded our expectations. Everything was in perfect condition and the staff was extremely helpful throughout the process. Our wedding day was truly magical thanks to these beautiful items.",
  },
  {
    id: 2,
    name: "Jessica & David",
    date: "February, 2024",
    image: "/testimonials/couple2.png",
    rating: 5,
    content: "We were completely impressed by the variety and easy rental process. The staff went above and beyond to ensure we had everything we needed. The classic items added a special touch to our wedding decoration.",
  },
  {
    id: 3,
    name: "Emily & James",
    date: "January, 2024",
    image: "/testimonials/couple3.png",
    rating: 5,
    content: "Renting wedding decorations was the best decision we made. The quality was excellent and the prices were very reasonable. The staff was professional and made the entire process easy.",
  },
  {
    id: 4,
    name: "Amanda & Craig",
    date: "April, 2024",
    image: "/testimonials/couple4.jpg",
    rating: 5,
    content: "We found everything we needed for our wedding day. The rental service was truly amazing and helped us save a lot of costs. Thank you to the team for making our special day even more perfect.",
  },
  {
    id: 5,
    name: "Phap & Hai",
    date: "April, 2025",
    image: "/testimonials/couple5.png",
    rating: 5,
    content: "We are very satisfied with the wedding dress rental service. Everything was well-prepared and on time. The consulting team was enthusiastic in helping us choose items that matched our wedding style. Our wedding day was truly memorable!",
  },
  {
    id: 6,
    name: "Ninh & Duong",
    date: "January, 2025",
    image: "/testimonials/couple6.png",
    rating: 5,
    content: "High-quality wedding dress rental service at reasonable prices. We were particularly impressed with the variety of items and the professionalism of the staff. Thank you for helping us have a perfect wedding!",
  },
]

export default function TestimonialsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Couples' Experiences</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Listen to the stories of couples who made their special day more meaningful with our rental items.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center mb-4">
              <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4">
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                <p className="text-gray-500">{testimonial.date}</p>
              </div>
            </div>
            <div className="flex mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-5 h-5 text-amber-500 fill-amber-500"
                />
              ))}
            </div>
            <p className="text-gray-700">{testimonial.content}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-semibold mb-4">Share Your Experience</h2>
        <p className="text-gray-600 mb-6">
          We would love to hear about your experience with our rental service.
        </p>
      </div>
    </div>
  )
} 