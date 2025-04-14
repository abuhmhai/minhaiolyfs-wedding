const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const categories = [
  { name: 'Ball Gown', slug: 'ball-gown' },
  { name: 'A-Line', slug: 'a-line' },
  { name: 'Mermaid', slug: 'mermaid' },
];

const weddingDresses = [
  {
    name: 'SERENA - VLTX-801 LUXURY BALL GOWN IVORY STRAIGHT ACROSS CHAPLE TRAIN LACE',
    description: 'Váy cưới cao cấp dáng chữ A với chất liệu ren tinh tế, thiết kế cổ ngang thanh lịch, phù hợp cho các cô dâu yêu thích phong cách cổ điển.',
    price: 22000000,
    image: 'https://ext.same-assets.com/44608533/4261772681.png',
    slug: 'serena-vltx-801-luxury-ball-gown-ivory-straight-across-chaple-train-lace',
    category: 'ball-gown',
    color: 'ivory',
  },
  {
    name: 'ISABELLA - VPFA-802 PREMIUM BALL GOWN OFFWHITE GODDESS COURT TRAIN LACE',
    description: 'Váy cưới dáng chữ A sang trọng với chất liệu ren tinh tế, thiết kế dây đeo mảnh và đuôi váy thanh lịch.',
    price: 19000000,
    image: 'https://ext.same-assets.com/44608533/3972856577.png',
    slug: 'isabella-vpfa-802-premium-ball-gown-offwhite-goddess-court-train-lace',
    category: 'ball-gown',
    color: 'offwhite',
  },
  {
    name: 'VICTORIA - VPFA-803 PREMIUM A-LINE IVORY BLING & GLAM SWEEP TRAIN HEAVY BEADED',
    description: 'Váy cưới dáng A-line với thiết kế lấp lánh và đính kết tinh xảo, tạo nên vẻ đẹp quý phái cho cô dâu.',
    price: 25000000,
    image: 'https://ext.same-assets.com/44608533/1470023077.png',
    slug: 'victoria-vpfa-803-premium-a-line-ivory-bling-glam-sweep-train-heavy-beaded',
    category: 'a-line',
    color: 'ivory',
  },
  {
    name: 'ELEANOR - VLTX-804 LUXURY BALL GOWN NUDE FLORAL SPAGHETTI STRAP COURT TRAIN FLORAL LACE',
    description: 'Váy cưới dáng chữ A với thiết kế dây đeo mảnh và họa tiết hoa ren tinh tế, mang đến vẻ đẹp thanh lịch.',
    price: 28000000,
    image: 'https://ext.same-assets.com/44608533/3092527618.png',
    slug: 'eleanor-vltx-804-luxury-ball-gown-nude-floral-spaghetti-strap-court-train-floral-lace',
    category: 'ball-gown',
    color: 'nude',
  },
  {
    name: 'CHARLOTTE - VPFA-805 PREMIUM A-LINE OFFWHITE ELEGANT OFF-SHOUDER FLOOR LENGTH SIMPLE',
    description: 'Váy cưới dáng A-line với thiết kế off-shoulder thanh lịch, phù hợp cho các cô dâu yêu thích sự đơn giản mà tinh tế.',
    price: 21000000,
    image: 'https://ext.same-assets.com/44608533/3671199880.png',
    slug: 'charlotte-vpfa-805-premium-a-line-offwhite-elegant-off-shouder-floor-length-simple',
    category: 'a-line',
    color: 'offwhite',
  },
  {
    name: 'MARGARET - VPFA-806 PREMIUM A-LINE IVORY ELEGANT SPAGHETTI STRAP FLOOR LENGTH FLORAL LACE',
    description: 'Váy cưới dáng A-line với thiết kế dây đeo mảnh và họa tiết hoa ren tinh tế, mang đến vẻ đẹp thanh lịch.',
    price: 23000000,
    image: 'https://ext.same-assets.com/44608533/3386758913.png',
    slug: 'margaret-vpfa-806-premium-a-line-ivory-elegant-spaghetti-strap-floor-length-floral-lace',
    category: 'a-line',
    color: 'ivory',
  },
  {
    name: 'ELIZABETH - VPDC-807 PREMIUM MERMAID OFFWHITE STRAIGHT ACROSS SWEEP TRAIN',
    description: 'Váy cưới dáng mermaid với thiết kế cổ ngang và đuôi váy thanh lịch, tôn lên vóc dáng của cô dâu.',
    price: 26000000,
    image: 'https://ext.same-assets.com/44608533/1314628157.png',
    slug: 'elizabeth-vpdc-807-premium-mermaid-offwhite-straight-across-sweep-train',
    category: 'mermaid',
    color: 'offwhite',
  },
  {
    name: 'CATHERINE - VPDC-808 PREMIUM MERMAID IVORY ELEGANT STRAIGHT ACROSS SWEEP TRAIN FLORAL LACE',
    description: 'Váy cưới dáng mermaid với thiết kế cổ ngang và họa tiết hoa ren tinh tế, mang đến vẻ đẹp thanh lịch.',
    price: 27000000,
    image: 'https://ext.same-assets.com/44608533/320492878.png',
    slug: 'catherine-vpdc-808-premium-mermaid-ivory-elegant-straight-across-sweep-train-floral-lace',
    category: 'mermaid',
    color: 'ivory',
  },
];

async function main() {
  try {
    // Create categories first
    for (const category of categories) {
      await prisma.category.upsert({
        where: { slug: category.slug },
        update: category,
        create: category,
      });
    }

    // Create products with category relations
    for (const dress of weddingDresses) {
      const category = await prisma.category.findUnique({
        where: { slug: dress.category },
      });

      if (!category) {
        throw new Error(`Category not found: ${dress.category}`);
      }

      const { category: categorySlug, ...productData } = dress;
      
      await prisma.product.upsert({
        where: { slug: dress.slug },
        update: {
          ...productData,
          categoryId: category.id,
        },
        create: {
          ...productData,
          categoryId: category.id,
        },
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