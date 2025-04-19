const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // Get the wedding dress category
    const category = await prisma.category.findUnique({
      where: { slug: 'ao-cuoi' }
    });

    if (!category) {
      console.log('Wedding dress category not found');
      return;
    }

    // Get all wedding dresses
    const dresses = await prisma.product.findMany({
      where: {
        categoryId: category.id
      }
    });

    console.log(`Found ${dresses.length} wedding dresses`);

    // Distribute styles evenly among dresses
    const styles = ['DANG_XOE_BALLGOWN', 'DANG_CHU_A', 'DANG_DUOI_CA_MERMAID'];
    const updates = dresses.map((dress, index) => {
      const style = styles[index % styles.length];
      return prisma.product.update({
        where: { id: dress.id },
        data: { style }
      });
    });

    const results = await Promise.all(updates);
    console.log('Updated dresses:', results.map(d => ({ name: d.name, style: d.style })));

  } catch (error) {
    console.error('Error updating styles:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 