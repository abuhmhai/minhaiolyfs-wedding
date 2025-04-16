const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const categories = [
  { name: 'Áo cưới', slug: 'ao-cuoi' },
  { name: 'Ball Gown', slug: 'ball-gown' },
  { name: 'A-Line', slug: 'a-line' },
  { name: 'Mermaid', slug: 'mermaid' },
  { name: 'Áo dài cô dâu', slug: 'ao-dai-co-dau' },
];

const weddingDresses = [
  {
    name: 'SERENA - VLTX-801 LUXURY BALL GOWN IVORY STRAIGHT ACROSS CHAPLE TRAIN LACE',
    description: 'Váy cưới cao cấp dáng chữ A với chất liệu ren tinh tế, thiết kế cổ ngang thanh lịch, phù hợp cho các cô dâu yêu thích phong cách cổ điển.',
    price: 22000000,
    images: ['https://ext.same-assets.com/44608533/4261772681.png'],
    slug: 'serena-vltx-801-luxury-ball-gown-ivory-straight-across-chaple-train-lace',
    category: 'ball-gown',
    color: 'ivory',
    stockQuantity: 10,
    status: 'IN_STOCK'
  },
  {
    name: 'ISABELLA - VPFA-802 PREMIUM BALL GOWN OFFWHITE GODDESS COURT TRAIN LACE',
    description: 'Váy cưới dáng chữ A sang trọng với chất liệu ren tinh tế, thiết kế dây đeo mảnh và đuôi váy thanh lịch.',
    price: 19000000,
    images: ['https://ext.same-assets.com/44608533/3972856577.png'],
    slug: 'isabella-vpfa-802-premium-ball-gown-offwhite-goddess-court-train-lace',
    category: 'ball-gown',
    color: 'offwhite',
    stockQuantity: 8,
    status: 'IN_STOCK'
  },
  {
    name: 'VICTORIA - VPFA-803 PREMIUM A-LINE IVORY BLING & GLAM SWEEP TRAIN HEAVY BEADED',
    description: 'Váy cưới dáng A-line với thiết kế lấp lánh và đính kết tinh xảo, tạo nên vẻ đẹp quý phái cho cô dâu.',
    price: 25000000,
    images: ['https://ext.same-assets.com/44608533/1470023077.png'],
    slug: 'victoria-vpfa-803-premium-a-line-ivory-bling-glam-sweep-train-heavy-beaded',
    category: 'a-line',
    color: 'ivory',
    stockQuantity: 5,
    status: 'IN_STOCK'
  },
  {
    name: 'ELEANOR - VLTX-804 LUXURY BALL GOWN NUDE FLORAL SPAGHETTI STRAP COURT TRAIN FLORAL LACE',
    description: 'Váy cưới dáng chữ A với thiết kế dây đeo mảnh và họa tiết hoa ren tinh tế, mang đến vẻ đẹp thanh lịch.',
    price: 28000000,
    images: ['https://ext.same-assets.com/44608533/3092527618.png'],
    slug: 'eleanor-vltx-804-luxury-ball-gown-nude-floral-spaghetti-strap-court-train-floral-lace',
    category: 'ball-gown',
    color: 'nude',
    stockQuantity: 3,
    status: 'IN_STOCK'
  },
  {
    name: 'CHARLOTTE - VPFA-805 PREMIUM A-LINE OFFWHITE ELEGANT OFF-SHOUDER FLOOR LENGTH SIMPLE',
    description: 'Váy cưới dáng A-line với thiết kế off-shoulder thanh lịch, phù hợp cho các cô dâu yêu thích sự đơn giản mà tinh tế.',
    price: 21000000,
    images: ['https://ext.same-assets.com/44608533/3671199880.png'],
    slug: 'charlotte-vpfa-805-premium-a-line-offwhite-elegant-off-shouder-floor-length-simple',
    category: 'a-line',
    color: 'offwhite',
    stockQuantity: 7,
    status: 'IN_STOCK'
  },
  {
    name: 'MARGARET - VPFA-806 PREMIUM A-LINE IVORY ELEGANT SPAGHETTI STRAP FLOOR LENGTH FLORAL LACE',
    description: 'Váy cưới dáng A-line với thiết kế dây đeo mảnh và họa tiết hoa ren tinh tế, mang đến vẻ đẹp thanh lịch.',
    price: 23000000,
    images: ['https://ext.same-assets.com/44608533/3386758913.png'],
    slug: 'margaret-vpfa-806-premium-a-line-ivory-elegant-spaghetti-strap-floor-length-floral-lace',
    category: 'a-line',
    color: 'ivory',
    stockQuantity: 4,
    status: 'IN_STOCK'
  },
  {
    name: 'ELIZABETH - VPDC-807 PREMIUM MERMAID OFFWHITE STRAIGHT ACROSS SWEEP TRAIN',
    description: 'Váy cưới dáng mermaid với thiết kế cổ ngang và đuôi váy thanh lịch, tôn lên vóc dáng của cô dâu.',
    price: 26000000,
    images: ['https://ext.same-assets.com/44608533/1314628157.png'],
    slug: 'elizabeth-vpdc-807-premium-mermaid-offwhite-straight-across-sweep-train',
    category: 'mermaid',
    color: 'offwhite',
    stockQuantity: 6,
    status: 'IN_STOCK'
  },
  {
    name: 'CATHERINE - VPDC-808 PREMIUM MERMAID IVORY ELEGANT STRAIGHT ACROSS SWEEP TRAIN FLORAL LACE',
    description: 'Váy cưới dáng mermaid với thiết kế cổ ngang và họa tiết hoa ren tinh tế, mang đến vẻ đẹp thanh lịch.',
    price: 27000000,
    images: ['https://ext.same-assets.com/44608533/320492878.png'],
    slug: 'catherine-vpdc-808-premium-mermaid-ivory-elegant-straight-across-sweep-train-floral-lace',
    category: 'mermaid',
    color: 'ivory',
    stockQuantity: 2,
    status: 'IN_STOCK'
  },
];

const aoDaiDresses = [
  {
    name: 'THƯONG DUNG - ÁO DÀI CÔ DÂU ADCD - 226',
    description: 'Áo dài cô dâu cao cấp với chất liệu vải và họa tiết thêu tay tinh xảo, phù hợp cho ngày vu quy.',
    price: 15000000,
    images: ['https://ext.same-assets.com/3216405869/3014493778.png'],
    slug: 'thuong-dung-ao-dai-co-dau-adcd-226',
    category: 'ao-dai-co-dau',
    color: 'red',
    stockQuantity: 5,
    status: 'IN_STOCK'
  },
  {
    name: 'VÂN NHƯ - ÁO DÀI CÔ DÂU ADCD - 228',
    description: 'Áo dài cô dâu truyền thống với điểm nhấn hiện đại, thêu họa tiết hoa sen tinh tế.',
    price: 16000000,
    images: ['https://ext.same-assets.com/3216405869/2241857545.png'],
    slug: 'van-nhu-ao-dai-co-dau-adcd-228',
    category: 'ao-dai-co-dau',
    color: 'red',
    stockQuantity: 3,
    status: 'IN_STOCK'
  },
  {
    name: 'KIỀU CHÂU - ÁO DÀI CÔ DÂU ADCD - 224',
    description: 'Áo dài cưới phong cách hoàng gia với họa tiết thêu tay công phu và đính kết cầu kỳ.',
    price: 18000000,
    images: ['https://ext.same-assets.com/3216405869/1335644271.png'],
    slug: 'kieu-chau-ao-dai-co-dau-adcd-224',
    category: 'ao-dai-co-dau',
    color: 'red',
    stockQuantity: 4,
    status: 'IN_STOCK'
  },
  {
    name: 'NGỌC DAO - ÁO DÀI CÔ DÂU ADCD - 225',
    description: 'Áo dài cô dâu hiện đại với điểm nhấn là những đường cắt may tinh tế và họa tiết độc đáo.',
    price: 17000000,
    images: ['https://ext.same-assets.com/3216405869/3014493778.png'],
    slug: 'ngoc-dao-ao-dai-co-dau-adcd-225',
    category: 'ao-dai-co-dau',
    color: 'red',
    stockQuantity: 6,
    status: 'IN_STOCK'
  },
  {
    name: 'BẠCH LIÊN - ÁO DÀI CÔ DÂU ADCD - 231',
    description: 'Áo dài cưới cao cấp với họa tiết hoa sen thêu tay, kết hợp với chất liệu lụa tơ tằm.',
    price: 19000000,
    images: ['https://ext.same-assets.com/3216405869/4218051108.png'],
    slug: 'bach-lien-ao-dai-co-dau-adcd-231',
    category: 'ao-dai-co-dau',
    color: 'red',
    stockQuantity: 3,
    status: 'IN_STOCK'
  },
  {
    name: 'ĐÔNG MAI - ÁO DÀI CÔ DÂU ADCD - 230',
    description: 'Áo dài cô dâu phong cách cổ điển với họa tiết thêu tay truyền thống và đính kết tinh xảo.',
    price: 16500000,
    images: ['https://ext.same-assets.com/3216405869/3014493778.png'],
    slug: 'dong-mai-ao-dai-co-dau-adcd-230',
    category: 'ao-dai-co-dau',
    color: 'red',
    stockQuantity: 4,
    status: 'IN_STOCK'
  },
  {
    name: 'THANH TÂM - ÁO DÀI CÔ DÂU ADCD - 227',
    description: 'Áo dài cưới sang trọng với chất liệu ren Pháp cao cấp và họa tiết thêu tay tinh tế.',
    price: 17500000,
    images: ['https://ext.same-assets.com/3216405869/809727370.png'],
    slug: 'thanh-tam-ao-dai-co-dau-adcd-227',
    category: 'ao-dai-co-dau',
    color: 'red',
    stockQuantity: 5,
    status: 'IN_STOCK'
  },
  {
    name: 'ÁO DÀI CÔ DÂU ADCD-220',
    description: 'Áo dài cô dâu truyền thống với thiết kế đơn giản nhưng tinh tế, phù hợp cho các cô dâu yêu thích sự nhẹ nhàng.',
    price: 15500000,
    images: ['https://ext.same-assets.com/3216405869/2538418983.png'],
    slug: 'ao-dai-co-dau-adcd-220',
    category: 'ao-dai-co-dau',
    color: 'red',
    stockQuantity: 4,
    status: 'IN_STOCK'
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

    // Create wedding dresses with category relations
    const allDresses = [...weddingDresses, ...aoDaiDresses];
    
    for (const dress of allDresses) {
      const category = await prisma.category.findUnique({
        where: { slug: dress.category },
      });

      if (!category) {
        throw new Error(`Category not found: ${dress.category}`);
      }

      const { category: categorySlug, images, ...productData } = dress;
      
      const product = await prisma.product.upsert({
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

      // Create product images
      for (const imageUrl of images) {
        await prisma.productImage.create({
          data: {
            url: imageUrl,
            productId: product.id,
          },
        });
      }
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