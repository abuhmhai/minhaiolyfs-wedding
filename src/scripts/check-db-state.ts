const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // Check categories
    const categories = await prisma.category.findMany();
    console.log('Categories:', categories);

    // Check ao-dai-co-dau category specifically
    const aoDaiCategory = await prisma.category.findUnique({
      where: { slug: 'ao-dai-co-dau' },
    });
    console.log('Ao Dai Category:', aoDaiCategory);

    if (aoDaiCategory) {
      // Check products in this category
      const products = await prisma.product.findMany({
        where: { categoryId: aoDaiCategory.id },
        include: { images: true },
      });
      console.log('Products in ao-dai-co-dau category:', products);
    }
  } catch (error) {
    console.error('Error checking database state:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 