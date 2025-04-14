const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    // Get both categories
    const [aoCuoiCategory, aoDaiCategory] = await Promise.all([
      prisma.category.findUnique({ where: { slug: 'ao-cuoi' } }),
      prisma.category.findUnique({ where: { slug: 'ao-dai-co-dau' } })
    ]);

    if (!aoCuoiCategory || !aoDaiCategory) {
      throw new Error('One or both categories not found');
    }

    // Get all products from both categories
    const [aoCuoiProducts, aoDaiProducts] = await Promise.all([
      prisma.product.findMany({ where: { categoryId: aoCuoiCategory.id } }),
      prisma.product.findMany({ where: { categoryId: aoDaiCategory.id } })
    ]);

    // Swap the categories
    const updates = [
      // Move Áo cưới products to Áo dài
      ...aoCuoiProducts.map(product => 
        prisma.product.update({
          where: { id: product.id },
          data: { categoryId: aoDaiCategory.id }
        })
      ),
      // Move Áo dài products to Áo cưới
      ...aoDaiProducts.map(product => 
        prisma.product.update({
          where: { id: product.id },
          data: { categoryId: aoCuoiCategory.id }
        })
      )
    ];

    await Promise.all(updates);

    console.log(`Successfully swapped ${aoCuoiProducts.length} products from Áo cưới to Áo dài`);
    console.log(`Successfully swapped ${aoDaiProducts.length} products from Áo dài to Áo cưới`);

    // Verify the counts
    const [aoCuoiCount, aoDaiCount] = await Promise.all([
      prisma.product.count({ where: { categoryId: aoCuoiCategory.id } }),
      prisma.product.count({ where: { categoryId: aoDaiCategory.id } })
    ]);

    console.log('Updated product counts:');
    console.log('- Áo cưới:', aoCuoiCount);
    console.log('- Áo dài cô dâu:', aoDaiCount);

  } catch (error) {
    console.error('Error swapping categories:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 