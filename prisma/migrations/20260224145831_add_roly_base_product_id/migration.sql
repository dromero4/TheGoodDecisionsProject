/*
  Warnings:

  - The primary key for the `RolyVariant` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `sku` on the `RolyVariant` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[productId,color_code,size]` on the table `RolyVariant` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "RolyProduct" ADD COLUMN     "baseProductId" TEXT;

-- AlterTable
ALTER TABLE "RolyVariant" DROP CONSTRAINT "RolyVariant_pkey",
DROP COLUMN "sku",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "RolyVariant_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE INDEX "RolyProduct_baseProductId_idx" ON "RolyProduct"("baseProductId");

-- CreateIndex
CREATE UNIQUE INDEX "RolyVariant_productId_color_code_size_key" ON "RolyVariant"("productId", "color_code", "size");
