const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    // Get the 'Áo dài cô dâu' category
    const aoDaiCategory = await prisma.category.findUnique({
      where: { slug: 'ao-dai-co-dau' }
    });

    if (!aoDaiCategory) {
      throw new Error('Áo dài cô dâu category not found');
    }

    // Get some products from 'Áo cưới' category to move
    const aoCuoiCategory = await prisma.category.findUnique({
      where: { slug: 'ao-cuoi' }
    });

    if (!aoCuoiCategory) {
      throw new Error('Áo cưới category not found');
    }

    // Get half of the products from 'Áo cưới' category
    const products = await prisma.product.findMany({
      where: { categoryId: aoCuoiCategory.id },
      take: 12 // Take half of the products
    });

    // Update these products to be in 'Áo dài cô dâu' category
    const updates = products.map(product => 
      prisma.product.update({
        where: { id: product.id },
        data: { categoryId: aoDaiCategory.id }
      })
    );

    await Promise.all(updates);

    console.log(`Moved ${updates.length} products to Áo dài cô dâu category`);

    // Verify the counts
    const [aoCuoiCount, aoDaiCount] = await Promise.all([
      prisma.product.count({ where: { categoryId: aoCuoiCategory.id } }),
      prisma.product.count({ where: { categoryId: aoDaiCategory.id } })
    ]);

    console.log('Updated product counts:');
    console.log('- Áo cưới:', aoCuoiCount);
    console.log('- Áo dài cô dâu:', aoDaiCount);

  } catch (error) {
    console.error('Error assigning products:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 