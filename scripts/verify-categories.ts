const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    // Verify categories exist
    const categories = await Promise.all([
      prisma.category.upsert({
        where: { slug: 'ao-cuoi' },
        update: {},
        create: {
          name: 'Áo cưới',
          slug: 'ao-cuoi',
        },
      }),
      prisma.category.upsert({
        where: { slug: 'ao-dai-co-dau' },
        update: {},
        create: {
          name: 'Áo dài cô dâu',
          slug: 'ao-dai-co-dau',
        },
      }),
    ]);

    console.log('Categories verified:', categories);

    // Count products in each category
    const productCounts = await Promise.all(
      categories.map(async (category) => {
        const count = await prisma.product.count({
          where: { categoryId: category.id },
        });
        return { category: category.name, count };
      })
    );

    console.log('Product counts by category:', productCounts);
  } catch (error) {
    console.error('Error verifying categories:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 