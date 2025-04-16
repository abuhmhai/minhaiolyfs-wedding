const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const aoDaiDresses = [
  {
    name: 'THIÊN HƯƠNG - VLTX-1001 LUXURY ÁO DÀI CÔ DÂU ĐỎ THÊU HOA',
    price: 15000000,
    image: 'https://ext.same-assets.com/3216405869/thien-huong-vltx-1001.png',
    slug: 'thien-huong-vltx-1001-luxury-ao-dai-co-dau-do-theu-hoa',
    color: 'red',
    stockQuantity: 5,
  },
  {
    name: 'NGỌC LAN - VPFA-1002 PREMIUM ÁO DÀI CÔ DÂU HỒNG THÊU RỒNG PHƯỢNG',
    price: 17000000,
    image: 'https://ext.same-assets.com/3216405869/ngoc-lan-vpfa-1002.png',
    slug: 'ngoc-lan-vpfa-1002-premium-ao-dai-co-dau-hong-theu-rong-phuong',
    color: 'pink',
    stockQuantity: 5,
  },
  {
    name: 'THƯONG DUNG - ÁO DÀI CÔ DÂU ADCD - 226',
    price: 5000000,
    image: 'https://ext.same-assets.com/3216405869/3014493778.png',
    slug: 'thuong-dung-ao-dai-co-dau-adcd-226',
    color: 'red',
    stockQuantity: 5,
  },
  {
    name: 'VÂN NHƯ - ÁO DÀI CÔ DÂU ADCD - 228',
    price: 4500000,
    image: 'https://ext.same-assets.com/3216405869/2241857545.png',
    slug: 'van-nhu-ao-dai-co-dau-adcd-228',
    color: 'pink',
    stockQuantity: 5,
  },
  {
    name: 'KIỀU CHÂU - ÁO DÀI CÔ DÂU ADCD - 224',
    price: 4500000,
    image: 'https://ext.same-assets.com/3216405869/1335644271.png',
    slug: 'kieu-chau-ao-dai-co-dau-adcd-224',
    color: 'white',
    stockQuantity: 5,
  },
  {
    name: 'NGỌC DAO - ÁO DÀI CÔ DÂU ADCD - 225',
    price: 4000000,
    image: 'https://ext.same-assets.com/3216405869/3014493778.png',
    slug: 'ngoc-dao-ao-dai-co-dau-adcd-225',
    color: 'white',
    stockQuantity: 5,
  },
  {
    name: 'BẠCH LIÊN - ÁO DÀI CÔ DÂU ADCD - 231',
    price: 3000000,
    image: 'https://ext.same-assets.com/3216405869/4218051108.png',
    slug: 'bach-lien-ao-dai-co-dau-adcd-231',
    color: 'white',
    stockQuantity: 5,
  },
  {
    name: 'ĐÔNG MAI - ÁO DÀI CÔ DÂU ADCD - 230',
    price: 3000000,
    image: 'https://ext.same-assets.com/3216405869/3014493778.png',
    slug: 'dong-mai-ao-dai-co-dau-adcd-230',
    color: 'red',
    stockQuantity: 5,
  },
  {
    name: 'THANH TÂM - ÁO DÀI CÔ DÂU ADCD - 227',
    price: 3000000,
    image: 'https://ext.same-assets.com/3216405869/809727370.png',
    slug: 'thanh-tam-ao-dai-co-dau-adcd-227',
    color: 'white',
    stockQuantity: 5,
  },
  {
    name: 'ÁO DÀI CÔ DÂU ADCD-220',
    price: 2500000,
    image: 'https://ext.same-assets.com/3216405869/2538418983.png',
    slug: 'ao-dai-co-dau-adcd-220',
    color: 'red',
    stockQuantity: 5,
  }
];

async function main() {
  try {
    // First, find or create the ao-dai-co-dau category
    const category = await prisma.category.upsert({
      where: { slug: 'ao-dai-co-dau' },
      update: {},
      create: {
        name: 'Áo dài cô dâu',
        slug: 'ao-dai-co-dau',
      },
    });

    console.log('Category created/updated:', category);

    // Then create all products
    for (const dress of aoDaiDresses) {
      const product = await prisma.product.upsert({
        where: { slug: dress.slug },
        update: {
          name: dress.name,
          price: dress.price,
          color: dress.color,
          stockQuantity: dress.stockQuantity,
          categoryId: category.id,
        },
        create: {
          name: dress.name,
          price: dress.price,
          slug: dress.slug,
          color: dress.color,
          stockQuantity: dress.stockQuantity,
          categoryId: category.id,
          images: {
            create: {
              url: dress.image,
            },
          },
        },
      });
      console.log('Product created/updated:', product.name);
    }

    console.log('Successfully seeded ao-dai products!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 