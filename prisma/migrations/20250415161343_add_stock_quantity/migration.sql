-- AlterTable
ALTER TABLE `Product` ADD COLUMN `stockQuantity` INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX `CartItem_cartId_fkey` ON `CartItem`(`cartId`);
