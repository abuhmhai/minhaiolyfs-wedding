/*
  Warnings:

  - You are about to alter the column `style` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.

*/
-- AlterTable
ALTER TABLE `Product` MODIFY `style` ENUM('DANG_XOE_BALLGOWN', 'DANG_CHU_A', 'DANG_DUOI_CA_MERMAID') NULL;
