const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const weddingDresses = [
  {
    name: 'AMARIS - VLTX-734 LUXURY BALL GOWN OFFWHITE STRAIGHT ACROSS CHAPLE TRAIN SIMPLE',
    description: 'Váy cưới cao cấp dáng chữ A chất liệu vải ren và lụa cao cấp, thiết kế tinh xảo, phù hợp cho các cô dâu lựa chọn khi chuẩn bị cho buổi lễ cưới.',
    price: 18000000,
    image: 'https://ext.same-assets.com/44608533/4261772681.png',
    slug: 'amaris-vltx-734-luxury-ball-gown-offwhite-straight-across-chaple-train-simple',
    category: 'ball-gown',
    color: 'offwhite',
  },
  {
    name: 'VALORA - VPFA-742 PREMIUM NUDE BALL GOWN IVORY GODDESS COURT TRAIN LACE',
    description: 'Váy cưới dáng chữ A sang trọng với chất liệu ren tinh tế, phù hợp cho các cô dâu yêu thích phong cách cổ điển.',
    price: 15000000,
    image: 'https://ext.same-assets.com/44608533/3972856577.png',
    slug: 'valora-vpfa-742-premium-nude-ball-gown-ivory-goddess-court-train-lace',
    category: 'ball-gown',
    color: 'ivory',
  },
  {
    name: 'MIRABELLA - VPFA-741 PREMIUM A-LINE OFFWHITE BLING & GLAM SWEEP TRAIN HEAVY BEADED',
    description: 'Váy cưới dáng A-line với thiết kế lấp lánh và đính kết tinh xảo, tạo nên vẻ đẹp quý phái cho cô dâu.',
    price: 15000000,
    image: 'https://ext.same-assets.com/44608533/1470023077.png',
    slug: 'mirabella-vpfa-741-premium-a-line-offwhite-bling-glam-sweep-train-heavy-beaded',
    category: 'a-line',
    color: 'offwhite',
  },
  {
    name: 'ROSELLE - VLTX-739 LUXURY BALL GOWN OFFWHITE FLORAL SPAGHETTI STRAP COURT TRAIN FLORAL LACE',
    description: 'Váy cưới dáng chữ A với thiết kế dây đeo mảnh và họa tiết hoa ren tinh tế, mang đến vẻ đẹp thanh lịch.',
    price: 20000000,
    image: 'https://ext.same-assets.com/44608533/3092527618.png',
    slug: 'roselle-vltx-739-luxury-ball-gown-offwhite-floral-spaghetti-strap-court-train-floral-lace',
    category: 'ball-gown',
    color: 'offwhite',
  },
  {
    name: 'EVELYN - VPFA-737 PREMIUM A-LINE OFFWHITE ELEGANT OFF-SHOUDER FLOOR LENGTH SIMPLE',
    description: 'Váy cưới dáng A-line với thiết kế off-shoulder thanh lịch, phù hợp cho các cô dâu yêu thích sự đơn giản mà tinh tế.',
    price: 15000000,
    image: 'https://ext.same-assets.com/44608533/3671199880.png',
    slug: 'evelyn-vpfa-737-premium-a-line-offwhite-elegant-off-shouder-floor-length-simple',
    category: 'a-line',
    color: 'offwhite',
  },
  {
    name: 'ALINA - VPFA-738 PREMIUM A-LINE IVORY ELEGANT SPAGHETTI STRAP FLOOR LENGTH FLORAL LACE',
    description: 'Váy cưới dáng A-line với thiết kế dây đeo mảnh và họa tiết hoa ren tinh tế, mang đến vẻ đẹp thanh lịch.',
    price: 15000000,
    image: 'https://ext.same-assets.com/44608533/3386758913.png',
    slug: 'alina-vpfa-738-premium-a-line-ivory-elegant-spaghetti-strap-floor-length-floral-lace',
    category: 'a-line',
    color: 'ivory',
  },
  {
    name: 'ADRIENNE - VPDC-735 PREMIUM MERMAID IVORY STRAIGHT ACROSS SWEEP TRAIN',
    description: 'Váy cưới dáng mermaid với thiết kế cổ ngang và đuôi váy thanh lịch, tôn lên vóc dáng của cô dâu.',
    price: 15000000,
    image: 'https://ext.same-assets.com/44608533/1314628157.png',
    slug: 'adrienne-vpdc-735-premium-mermaid-ivory-straight-across-sweep-train',
    category: 'mermaid',
    color: 'ivory',
  },
  {
    name: 'NIVARA - VPDC-736 PREMIUM A-LINE NUDE ELEGANT STRAIGHT ACROSS SWEEP TRAIN FLORAL LACE',
    description: 'Váy cưới dáng A-line với thiết kế cổ ngang và họa tiết hoa ren tinh tế, mang đến vẻ đẹp thanh lịch.',
    price: 15000000,
    image: 'https://ext.same-assets.com/44608533/320492878.png',
    slug: 'nivara-vpdc-736-premium-a-line-nude-elegant-straight-across-sweep-train-floral-lace',
    category: 'a-line',
    color: 'nude',
  },
];

async function main() {
  try {
    // Create products
    for (const dress of weddingDresses) {
      await prisma.product.upsert({
        where: { slug: dress.slug },
        update: dress,
        create: dress,
      });
    }
    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 