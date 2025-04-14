"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const aoDaiDresses = [
    {
        name: 'THƯONG DUNG - ÁO DÀI CÔ DÂU ADCD - 226',
        image: 'https://ext.same-assets.com/3216405869/3014493778.png',
    },
    {
        name: 'VÂN NHƯ - ÁO DÀI CÔ DÂU ADCD - 228',
        image: 'https://ext.same-assets.com/3216405869/2241857545.png',
    },
    {
        name: 'KIỀU CHÂU - ÁO DÀI CÔ DÂU ADCD - 224',
        image: 'https://ext.same-assets.com/3216405869/1335644271.png',
    },
    {
        name: 'NGỌC DAO - ÁO DÀI CÔ DÂU ADCD - 225',
        image: 'https://ext.same-assets.com/3216405869/3014493778.png',
    },
    {
        name: 'BẠCH LIÊN - ÁO DÀI CÔ DÂU ADCD - 231',
        image: 'https://ext.same-assets.com/3216405869/4218051108.png',
    },
    {
        name: 'ĐÔNG MAI - ÁO DÀI CÔ DÂU ADCD - 230',
        image: 'https://ext.same-assets.com/3216405869/3014493778.png',
    },
    {
        name: 'THANH TÂM - ÁO DÀI CÔ DÂU ADCD - 227',
        image: 'https://ext.same-assets.com/3216405869/809727370.png',
    },
    {
        name: 'ÁO DÀI CÔ DÂU ADCD-220',
        image: 'https://ext.same-assets.com/3216405869/2538418983.png',
    },
];
async function updateProductImages() {
    try {
        for (const dress of aoDaiDresses) {
            // First find the product
            const product = await prisma.product.findFirst({
                where: {
                    name: dress.name,
                },
                include: {
                    images: true,
                },
            });
            if (!product) {
                console.log(`Product not found: ${dress.name}`);
                continue;
            }
            if (product.images.length > 0) {
                // Update existing image
                await prisma.productImage.update({
                    where: {
                        id: product.images[0].id,
                    },
                    data: {
                        url: dress.image,
                    },
                });
            }
            else {
                // Create new image
                await prisma.productImage.create({
                    data: {
                        url: dress.image,
                        productId: product.id,
                    },
                });
            }
            console.log(`Updated image for product: ${dress.name}`);
        }
        console.log('All product images updated successfully');
    }
    catch (error) {
        console.error('Error updating product images:', error);
    }
    finally {
        await prisma.$disconnect();
    }
}
updateProductImages();
