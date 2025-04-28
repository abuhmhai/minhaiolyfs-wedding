const { PrismaClient, ProductStatus } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed process...');
  
  // Clean up existing data
  console.log('Cleaning up existing data...');
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productRentalDuration.deleteMany();
  await prisma.productSize.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.blog.deleteMany();
  await prisma.user.deleteMany();
  console.log('Cleanup completed');

  // Create categories
  console.log('Creating categories...');
  const aoCuoi = await prisma.category.create({
    data: {
      name: 'Áo cưới',
      slug: 'ao-cuoi',
    },
  });
  console.log('Created category:', aoCuoi);

  const aoDaiCoDau = await prisma.category.create({
    data: {
      name: 'Áo dài cô dâu',
      slug: 'ao-dai-co-dau',
    },
  });
  console.log('Created category:', aoDaiCoDau);

  // Create wedding dresses (Áo cưới)
  console.log('Creating wedding dresses...');
  const weddingDresses = [
    {
      name: 'SERENA - VLTX-801 LUXURY BALL GOWN IVORY STRAIGHT ACROSS CHAPLE TRAIN LACE',
      description: 'Váy cưới cao cấp dáng chữ A với chất liệu ren tinh tế, thiết kế cổ ngang thanh lịch, phù hợp cho các cô dâu yêu thích phong cách cổ điển.',
      price: 22000000,
      color: 'ivory',
      style: 'dang-xoe-ballgown',
      stockQuantity: 11,
      categoryId: aoCuoi.id,
      status: ProductStatus.IN_STOCK,
      images: {
        create: [
          { url: 'https://ext.same-assets.com/44608533/4261772681.png' },
          { url: 'https://product.hstatic.net/1000259246/product/trang_1_39adb20f00804f70b50429f224c4c5f5_large.jpg' }
        ]
      }
    },
    {
      name: 'ISABELLA - VPFA-802 PREMIUM BALL GOWN OFFWHITE GODDESS COURT TRAIN LACE',
      description: 'Váy cưới dáng chữ A sang trọng với chất liệu ren tinh tế, thiết kế dây đeo mảnh và đuôi váy thanh lịch.',
      price: 19000000,
      color: 'offwhite',
      style: 'dang-xoe-ballgown',
      stockQuantity: 1,
      categoryId: aoCuoi.id,
      status: ProductStatus.LOW_STOCK,
      images: {
        create: [
          { url: 'https://ext.same-assets.com/44608533/3972856577.png' }
        ]
      }
    },
    {
      name: 'VICTORIA - VPFA-803 PREMIUM A-LINE IVORY BLING & GLAM SWEEP TRAIN HEAVY BEADED',
      description: 'Váy cưới dáng A-line với thiết kế lấp lánh và đính kết tinh xảo, tạo nên vẻ đẹp quý phái cho cô dâu.',
      price: 25000000,
      color: 'ivory',
      style: 'dang-chu-a',
      stockQuantity: 1,
      categoryId: aoCuoi.id,
      status: ProductStatus.LOW_STOCK,
      images: {
        create: [
          { url: 'https://ext.same-assets.com/44608533/1470023077.png' }
        ]
      }
    },
    {
      name: 'ELEANOR - VLTX-804 LUXURY BALL GOWN NUDE FLORAL SPAGHETTI STRAP COURT TRAIN FLORAL LACE',
      description: 'Váy cưới dáng chữ A với thiết kế dây đeo mảnh và họa tiết hoa ren tinh tế, mang đến vẻ đẹp thanh lịch.',
      price: 28000000,
      color: 'nude',
      style: 'dang-xoe-ballgown',
      stockQuantity: 3,
      categoryId: aoCuoi.id,
      status: ProductStatus.IN_STOCK,
      images: {
        create: [
          { url: 'https://ext.same-assets.com/44608533/3092527618.png' }
        ]
      }
    },
    {
      name: 'CHARLOTTE - VPFA-805 PREMIUM A-LINE OFFWHITE ELEGANT OFF-SHOUDER FLOOR LENGTH SIMPLE',
      description: 'Váy cưới dáng A-line với thiết kế off-shoulder thanh lịch, phù hợp cho các cô dâu yêu thích sự đơn giản mà tinh tế.',
      price: 21000000,
      color: 'offwhite',
      style: 'dang-chu-a',
      stockQuantity: 7,
      categoryId: aoCuoi.id,
      status: ProductStatus.IN_STOCK,
      images: {
        create: [
          { url: 'https://ext.same-assets.com/44608533/3671199880.png' }
        ]
      }
    },
    {
      name: 'MARGARET - VPFA-806 PREMIUM A-LINE IVORY ELEGANT SPAGHETTI STRAP FLOOR LENGTH FLORAL LACE',
      description: 'Váy cưới dáng A-line với thiết kế dây đeo mảnh và họa tiết hoa ren tinh tế, mang đến vẻ đẹp thanh lịch.',
      price: 23000000,
      color: 'ivory',
      style: 'dang-chu-a',
      stockQuantity: 4,
      categoryId: aoCuoi.id,
      status: ProductStatus.IN_STOCK,
      images: {
        create: [
          { url: 'https://ext.same-assets.com/44608533/3386758913.png' }
        ]
      }
    },
    {
      name: 'ELIZABETH - VPDC-807 PREMIUM MERMAID OFFWHITE STRAIGHT ACROSS SWEEP TRAIN',
      description: 'Váy cưới dáng mermaid với thiết kế cổ ngang và đuôi váy thanh lịch, tôn lên vóc dáng của cô dâu.',
      price: 26000000,
      color: 'offwhite',
      style: 'dang-mermaid',
      stockQuantity: 6,
      categoryId: aoCuoi.id,
      status: ProductStatus.IN_STOCK,
      images: {
        create: [
          { url: 'https://ext.same-assets.com/44608533/1314628157.png' }
        ]
      }
    },
    {
      name: 'CATHERINE - VPDC-808 PREMIUM MERMAID IVORY ELEGANT STRAIGHT ACROSS SWEEP TRAIN FLORAL LACE',
      description: 'Váy cưới dáng mermaid với thiết kế cổ ngang và họa tiết hoa ren tinh tế, mang đến vẻ đẹp thanh lịch.',
      price: 27000000,
      color: 'ivory',
      style: 'dang-mermaid',
      stockQuantity: 2,
      categoryId: aoCuoi.id,
      status: ProductStatus.IN_STOCK,
      images: {
        create: [
          { url: 'https://ext.same-assets.com/44608533/320492878.png' }
        ]
      }
    }
  ];

  // Create traditional dresses (Áo dài cô dâu)
  console.log('Creating traditional dresses...');
  const traditionalDresses = [
    {
      name: 'THIEN HUONG - VLTX-1001 LUXURY BRIDAL AO DAI RED WITH EMBROIDERED FLOWERS',
      description: 'High-end red bridal ao dai with delicate embroidered flower patterns, perfect for the wedding day.',
      price: 15000000,
      color: 'red',
      stockQuantity: 5,
      categoryId: aoDaiCoDau.id,
      status: ProductStatus.IN_STOCK,
      images: {
        create: [
          { url: 'https://ext.same-assets.com/3216405869/thien-huong-vltx-1001.png' }
        ]
      }
    },
    {
      name: 'NGOC LAN - VPFA-1002 PREMIUM BRIDAL AO DAI PINK WITH DRAGON PHOENIX EMBROIDERY',
      description: 'High-end pink bridal ao dai with traditional dragon phoenix embroidery patterns.',
      price: 17000000,
      color: 'pink',
      stockQuantity: 5,
      categoryId: aoDaiCoDau.id,
      status: ProductStatus.IN_STOCK,
      images: {
        create: [
          { url: 'https://ext.same-assets.com/3216405869/ngoc-lan-vpfa-1002.png' }
        ]
      }
    },
    {
      name: 'KIEU CHAU - BRIDAL AO DAI ADCD - 224',
      description: 'Traditional white bridal ao dai, simple and elegant design.',
      price: 4500000,
      color: 'white',
      stockQuantity: 5,
      categoryId: aoDaiCoDau.id,
      status: ProductStatus.IN_STOCK,
      images: {
        create: [
          { url: 'https://ext.same-assets.com/3216405869/1335644271.png' }
        ]
      }
    }
  ];

  // Create products
  console.log('Creating products...');
  for (const dress of weddingDresses) {
    const createdDress = await prisma.product.create({
      data: {
        ...dress,
        slug: dress.name
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/đ/g, 'd')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
      }
    });
    console.log('Created wedding dress:', createdDress.name);
  }

  for (const dress of traditionalDresses) {
    const createdDress = await prisma.product.create({
      data: {
        ...dress,
        slug: dress.name
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/đ/g, 'd')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
      }
    });
    console.log('Created traditional dress:', createdDress.name);
  }

  // Create admin user
  console.log('Creating admin user...');
  const admin = await prisma.user.create({
    data: {
      email: 'admin@nhungtrang.com',
      password: '$2b$10$NkXQRGfbBp08wD3nDduEW.pzyaJXJTI1wV3f6K5R9tEUbbK45a6Cu', // hashed password for 'password123'
      fullName: 'Admin',
      role: 'admin',
      phone: '0123456789'
    }
  });
  console.log('Created admin user:', admin.email);
  console.log('Seed process completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });