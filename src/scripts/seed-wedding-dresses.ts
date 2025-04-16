import { prisma } from "@/lib/prisma";
import { ProductStatus } from "@prisma/client";

const products = [
  {
    name: "SERENA - VLTX-801 LUXURY BALL GOWN IVORY STRAIGHT ACROSS CHAPLE TRAIN LACE",
    description: "Váy cưới cao cấp dáng chữ A với chất liệu ren tinh tế, thiết kế cổ ngang thanh lịch, phù hợp cho các cô dâu yêu thích phong cách cổ điển.",
    price: 22000000,
    categorySlug: "ball-gown",
    color: "ivory",
    images: ["https://ext.same-assets.com/44608533/4261772681.png"],
  },
  {
    name: "ISABELLA - VPFA-802 PREMIUM BALL GOWN OFFWHITE GODDESS COURT TRAIN LACE",
    description: "Váy cưới dáng chữ A sang trọng với chất liệu ren tinh tế, thiết kế dây đeo mảnh và đuôi váy thanh lịch.",
    price: 19000000,
    categorySlug: "ball-gown",
    color: "offwhite",
    images: ["https://ext.same-assets.com/44608533/3972856577.png"],
  },
  {
    name: "VICTORIA - VPFA-803 PREMIUM A-LINE IVORY BLING & GLAM SWEEP TRAIN HEAVY BEADED",
    description: "Váy cưới dáng A-line với thiết kế lấp lánh và đính kết tinh xảo, tạo nên vẻ đẹp quý phái cho cô dâu.",
    price: 25000000,
    categorySlug: "a-line",
    color: "ivory",
    images: ["https://ext.same-assets.com/44608533/1470023077.png"],
  },
  {
    name: "ELEANOR - VLTX-804 LUXURY BALL GOWN NUDE FLORAL SPAGHETTI STRAP COURT TRAIN FLORAL LACE",
    description: "Váy cưới dáng chữ A với thiết kế dây đeo mảnh và họa tiết hoa ren tinh tế, mang đến vẻ đẹp thanh lịch.",
    price: 28000000,
    categorySlug: "ball-gown",
    color: "nude",
    images: ["https://ext.same-assets.com/44608533/3092527618.png"],
  },
  {
    name: "CHARLOTTE - VPFA-805 PREMIUM A-LINE OFFWHITE ELEGANT OFF-SHOUDER FLOOR LENGTH SIMPLE",
    description: "Váy cưới dáng A-line với thiết kế off-shoulder thanh lịch, phù hợp cho các cô dâu yêu thích sự đơn giản mà tinh tế.",
    price: 21000000,
    categorySlug: "a-line",
    color: "offwhite",
    images: ["https://ext.same-assets.com/44608533/3671199880.png"],
  },
  {
    name: "MARGARET - VPFA-806 PREMIUM A-LINE IVORY ELEGANT SPAGHETTI STRAP FLOOR LENGTH FLORAL LACE",
    description: "Váy cưới dáng A-line với thiết kế dây đeo mảnh và họa tiết hoa ren tinh tế, mang đến vẻ đẹp thanh lịch.",
    price: 23000000,
    categorySlug: "a-line",
    color: "ivory",
    images: ["https://ext.same-assets.com/44608533/4261772681.png"],
  },
  {
    name: "ELIZABETH - VPDC-807 PREMIUM MERMAID OFFWHITE STRAIGHT ACROSS SWEEP TRAIN",
    description: "Váy cưới dáng mermaid với thiết kế cổ ngang và đuôi váy thanh lịch, tôn lên vóc dáng của cô dâu.",
    price: 26000000,
    categorySlug: "mermaid",
    color: "offwhite",
    images: ["https://ext.same-assets.com/44608533/3972856577.png"],
  },
  {
    name: "CATHERINE - VPDC-808 PREMIUM MERMAID IVORY ELEGANT STRAIGHT ACROSS SWEEP TRAIN FLORAL LACE",
    description: "Váy cưới dáng mermaid với thiết kế cổ ngang và họa tiết hoa ren tinh tế, mang đến vẻ đẹp thanh lịch.",
    price: 27000000,
    categorySlug: "mermaid",
    color: "ivory",
    images: ["https://ext.same-assets.com/44608533/1470023077.png"],
  },
  {
    name: "THƯONG DUNG - ÁO DÀI CÔ DÂU ADCD - 226",
    description: "Áo dài cô dâu cao cấp với chất liệu vải và họa tiết thêu tay tinh xảo, phù hợp cho ngày vu quy.",
    price: 15000000,
    categorySlug: "ao-dai-co-dau",
    color: "red",
    images: ["https://ext.same-assets.com/44608533/ao-dai-226.png"],
  },
  {
    name: "VÂN NHƯ - ÁO DÀI CÔ DÂU ADCD - 228",
    description: "Áo dài cô dâu truyền thống với điểm nhấn hiện đại, thêu họa tiết hoa sen tinh tế.",
    price: 16000000,
    categorySlug: "ao-dai-co-dau",
    color: "red",
    images: ["https://ext.same-assets.com/44608533/ao-dai-228.png"],
  },
  {
    name: "KIỀU CHÂU - ÁO DÀI CÔ DÂU ADCD - 224",
    description: "Áo dài cưới phong cách hoàng gia với họa tiết thêu tay công phu và đính kết cầu kỳ.",
    price: 18000000,
    categorySlug: "ao-dai-co-dau",
    color: "red",
    images: ["https://ext.same-assets.com/44608533/ao-dai-224.png"],
  },
  {
    name: "NGỌC DAO - ÁO DÀI CÔ DÂU ADCD - 225",
    description: "Áo dài cô dâu hiện đại với điểm nhấn là những đường cắt may tinh tế và họa tiết độc đáo.",
    price: 17000000,
    categorySlug: "ao-dai-co-dau",
    color: "red",
    images: ["https://ext.same-assets.com/44608533/ao-dai-225.png"],
  },
  {
    name: "BẠCH LIÊN - ÁO DÀI CÔ DÂU ADCD - 231",
    description: "Áo dài cưới cao cấp với họa tiết hoa sen thêu tay, kết hợp với chất liệu lụa tơ tằm.",
    price: 19000000,
    categorySlug: "ao-dai-co-dau",
    color: "red",
    images: ["https://ext.same-assets.com/44608533/ao-dai-231.png"],
  },
  {
    name: "ĐÔNG MAI - ÁO DÀI CÔ DÂU ADCD - 230",
    description: "Áo dài cô dâu phong cách cổ điển với họa tiết thêu tay truyền thống và đính kết tinh xảo.",
    price: 16500000,
    categorySlug: "ao-dai-co-dau",
    color: "red",
    images: ["https://ext.same-assets.com/44608533/ao-dai-230.png"],
  },
  {
    name: "THANH TÂM - ÁO DÀI CÔ DÂU ADCD - 227",
    description: "Áo dài cưới sang trọng với chất liệu ren Pháp cao cấp và họa tiết thêu tay tinh tế.",
    price: 17500000,
    categorySlug: "ao-dai-co-dau",
    color: "red",
    images: ["https://ext.same-assets.com/44608533/ao-dai-227.png"],
  },
  {
    name: "ÁO DÀI CÔ DÂU ADCD-220",
    description: "Áo dài cô dâu truyền thống với thiết kế đơn giản nhưng tinh tế, phù hợp cho các cô dâu yêu thích sự nhẹ nhàng.",
    price: 15500000,
    categorySlug: "ao-dai-co-dau",
    color: "red",
    images: ["https://ext.same-assets.com/44608533/ao-dai-220.png"],
  },
];

async function main() {
  try {
    // First, delete all existing product images
    await prisma.productImage.deleteMany({});
    console.log("Deleted all existing product images");

    // Then delete all existing products
    await prisma.product.deleteMany({});
    console.log("Deleted all existing products");

    // Then add new products
    for (const product of products) {
      const category = await prisma.category.findUnique({
        where: { slug: product.categorySlug },
      });

      if (!category) {
        console.error(`Category ${product.categorySlug} not found`);
        continue;
      }

      const slug = product.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      await prisma.product.create({
        data: {
          name: product.name,
          description: product.description,
          price: product.price,
          categoryId: category.id,
          color: product.color,
          status: ProductStatus.IN_STOCK,
          stockQuantity: 1,
          slug,
          images: {
            create: product.images.map((url) => ({
              url,
            })),
          },
        },
      });

      console.log(`Added ${product.name}`);
    }

    console.log("All products added successfully");
  } catch (error) {
    console.error("Error adding products:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 