/*
  Warnings:

  - A unique constraint covering the columns `[productId,size,color,sku]` on the table `Variant` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Variant_productId_size_color_key";

-- AlterTable
ALTER TABLE "Variant" ADD COLUMN     "sku" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Variant_productId_size_color_sku_key" ON "Variant"("productId", "size", "color", "sku");
