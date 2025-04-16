const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const correctSlugs = [
  'thuong-dung-ao-dai-co-dau-adcd-226',
  'van-nhu-ao-dai-co-dau-adcd-228',
  'kieu-chau-ao-dai-co-dau-adcd-224',
  'ngoc-dao-ao-dai-co-dau-adcd-225',
  'bach-lien-ao-dai-co-dau-adcd-231',
  'dong-mai-ao-dai-co-dau-adcd-230',
  'thanh-tam-ao-dai-co-dau-adcd-227',
  'ao-dai-co-dau-adcd-220',
  'thien-huong-vltx-1001-luxury-ao-dai-co-dau-do-theu-hoa',
  'ngoc-lan-vpfa-1002-premium-ao-dai-co-dau-hong-theu-rong-phuong'
];

interface Product {
  id: number;
  name: string;
  slug: string;
  images: { url: string }[];
}

async function main() {
  try {
    // Get the ao-dai-co-dau category
    const category = await prisma.category.findUnique({
      where: { slug: 'ao-dai-co-dau' },
    });

    if (!category) {
      console.log('Category not found');
      return;
    }

    // Get products to delete
    const productsToDelete = await prisma.product.findMany({
      where: {
        categoryId: category.id,
        NOT: {
          slug: {
            in: correctSlugs
          }
        }
      },
      include: {
        images: true
      }
    });

    console.log(`Found ${productsToDelete.length} products to delete`);

    // Delete related records first
    for (const product of productsToDelete) {
      // Delete images
      await prisma.productImage.deleteMany({
        where: {
          productId: product.id
        }
      });

      // Delete the product
      await prisma.product.delete({
        where: {
          id: product.id
        }
      });

      console.log(`Deleted product: ${product.name}`);
    }

    // Verify remaining products
    const remainingProducts = await prisma.product.findMany({
      where: {
        categoryId: category.id
      },
      include: {
        images: true
      }
    });

    console.log('Remaining products:', remainingProducts.map((p: Product) => p.slug));
  } catch (error) {
    console.error('Error cleaning up products:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 