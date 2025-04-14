const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    // Get the target category (Áo cưới)
    const aoCuoiCategory = await prisma.category.findUnique({
      where: { slug: 'ao-cuoi' }
    });

    if (!aoCuoiCategory) {
      throw new Error('Áo cưới category not found');
    }

    // Find the specific product
    const product = await prisma.product.findFirst({
      where: {
        name: {
          contains: 'ROSELLE - VLTX-739 LUXURY BALL GOWN'
        }
      }
    });

    if (!product) {
      throw new Error('Product not found');
    }

    // Update the product's category
    await prisma.product.update({
      where: { id: product.id },
      data: { categoryId: aoCuoiCategory.id }
    });

    console.log(`Successfully moved product "${product.name}" to Áo cưới category`);

    // Verify the counts
    const [aoCuoiCount, aoDaiCount] = await Promise.all([
      prisma.product.count({ where: { categoryId: aoCuoiCategory.id } }),
      prisma.product.count({ 
        where: { 
          categoryId: {
            not: aoCuoiCategory.id
          }
        } 
      })
    ]);

    console.log('Updated product counts:');
    console.log('- Áo cưới:', aoCuoiCount);
    console.log('- Áo dài cô dâu:', aoDaiCount);

  } catch (error) {
    console.error('Error moving product:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 