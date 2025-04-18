import { Metadata } from "next"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Cảm Nhận | Cho Thuê Đồ Cưới",
  description: "Đọc những chia sẻ từ các cặp đôi hạnh phúc về trải nghiệm thuê đồ cưới của họ.",
}

const testimonials = [
  {
    id: 1,
    name: "Sarah & Michael",
    date: "Tháng 3, 2024",
    image: "/testimonials/couple1.png",
    content: "Chất lượng đồ thuê vượt xa mong đợi của chúng tôi. Mọi thứ đều trong tình trạng hoàn hảo và đội ngũ nhân viên vô cùng nhiệt tình trong suốt quá trình. Ngày cưới của chúng tôi thật sự kỳ diệu nhờ những món đồ xinh đẹp này.",
  },
  {
    id: 2,
    name: "Jessica & David",
    date: "Tháng 2, 2024",
    image: "/testimonials/couple2.png",
    content: "Chúng tôi hoàn toàn bị ấn tượng bởi sự đa dạng và quy trình thuê đồ dễ dàng. Đội ngũ nhân viên đã vượt xa mong đợi để đảm bảo chúng tôi có mọi thứ cần thiết. Những món đồ cổ điển đã tạo nên điểm nhấn đặc biệt cho trang trí đám cưới của chúng tôi.",
  },
  {
    id: 3,
    name: "Emily & James",
    date: "Tháng 1, 2024",
    image: "/testimonials/couple3.png",
    content: "Thuê đồ trang trí đám cưới là quyết định tốt nhất chúng tôi đã thực hiện. Chất lượng tuyệt vời và giá cả rất hợp lý. Đội ngũ nhân viên chuyên nghiệp và giúp toàn bộ quá trình trở nên dễ dàng.",
  },
  {
    id: 4,
    name: "Amanda & Craig",
    date: "Tháng 4, 2024",
    image: "/testimonials/couple4.jpg",
    content: "Chúng tôi đã tìm thấy mọi thứ chúng tôi cần cho ngày cưới của mình. Dịch vụ thuê đồ thật sự tuyệt vời và giúp chúng tôi tiết kiệm được rất nhiều chi phí. Cảm ơn đội ngũ đã giúp ngày trọng đại của chúng tôi thêm phần hoàn hảo.",
  },
  {
    id: 5,
    name: "Pháp & Hải",
    date: "Tháng 4, 2025",
    image: "/testimonials/couple5.png",
    content: "Chúng tôi rất hài lòng với dịch vụ thuê đồ cưới. Mọi thứ đều được chuẩn bị chu đáo và đúng hẹn. Đội ngũ tư vấn nhiệt tình giúp chúng tôi lựa chọn được những món đồ phù hợp với phong cách đám cưới. Ngày cưới của chúng tôi thật sự đáng nhớ!",
  },
  {
    id: 6,
    name: "Ninh & Dương",
    date: "Tháng 1, 2025",
    image: "/testimonials/couple6.png",
    content: "Dịch vụ thuê đồ cưới chất lượng cao với giá cả phải chăng. Chúng tôi đặc biệt ấn tượng với sự đa dạng của các món đồ và sự chuyên nghiệp của đội ngũ nhân viên. Cảm ơn các bạn đã giúp chúng tôi có một đám cưới hoàn hảo!",
  },
]

export default function TestimonialsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Cảm Nhận Của Các Cặp Đôi</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Lắng nghe chia sẻ từ các cặp đôi đã làm cho ngày trọng đại của họ thêm phần ý nghĩa với các món đồ thuê của chúng tôi.
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
            <p className="text-gray-700">{testimonial.content}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-semibold mb-4">Chia Sẻ Trải Nghiệm Của Bạn</h2>
        <p className="text-gray-600 mb-6">
          Chúng tôi rất muốn lắng nghe trải nghiệm của bạn về dịch vụ thuê đồ của chúng tôi.
        </p>
        
      </div>
    </div>
  )
} 