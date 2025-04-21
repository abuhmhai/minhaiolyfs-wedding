import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    // Export categories
    const categories = await prisma.category.findMany()
    require('fs').writeFileSync('data/categories.json', JSON.stringify(categories, null, 2))
    console.log('Categories exported')

    // Export products
    const products = await prisma.product.findMany({
      include: {
        category: true,
        images: true
      }
    })
    require('fs').writeFileSync('data/products.json', JSON.stringify(products, null, 2))
    console.log('Products exported')

    // Export product images
    const productImages = await prisma.productImage.findMany()
    require('fs').writeFileSync('data/product-images.json', JSON.stringify(productImages, null, 2))
    console.log('Product images exported')

  } catch (error) {
    console.error('Error exporting data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main() 