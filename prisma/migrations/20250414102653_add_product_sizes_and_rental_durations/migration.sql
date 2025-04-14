/*
  Warnings:

  - You are about to alter the column `status` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(2))`.
  - You are about to drop the column `isAvailable` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `CartItem` ADD COLUMN `rentalDurationId` INTEGER NULL,
    ADD COLUMN `size` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Order` MODIFY `status` ENUM('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `OrderItem` ADD COLUMN `rentalDurationId` INTEGER NULL,
    ADD COLUMN `size` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Product` DROP COLUMN `isAvailable`,
    DROP COLUMN `size`,
    ADD COLUMN `status` ENUM('IN_STOCK', 'OUT_OF_STOCK') NOT NULL DEFAULT 'IN_STOCK';

-- CreateTable
CREATE TABLE `ProductSize` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `productId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductRentalDuration` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL,
    `productId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProductSize` ADD CONSTRAINT `ProductSize_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductRentalDuration` ADD CONSTRAINT `ProductRentalDuration_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CartItem` ADD CONSTRAINT `CartItem_rentalDurationId_fkey` FOREIGN KEY (`rentalDurationId`) REFERENCES `ProductRentalDuration`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_rentalDurationId_fkey` FOREIGN KEY (`rentalDurationId`) REFERENCES `ProductRentalDuration`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
