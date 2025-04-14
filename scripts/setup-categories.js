"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    // Create categories if they don't exist
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
    console.log('Categories created:', categories);
    // Get all products without a category
    const productsWithoutCategory = await prisma.product.findMany({
        where: {
            categoryId: {
                equals: undefined
            },
        },
    });
    // Update products without a category to default to 'ao-cuoi'
    if (productsWithoutCategory.length > 0) {
        await prisma.product.updateMany({
            where: {
                categoryId: {
                    equals: undefined
                },
            },
            data: {
                categoryId: categories[0].id,
            },
        });
        console.log(`Updated ${productsWithoutCategory.length} products with default category`);
    }
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
