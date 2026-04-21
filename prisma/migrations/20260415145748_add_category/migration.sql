/*
  Warnings:

  - The primary key for the `RolyVariant` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `colorProductId` on the `RolyVariant` table. All the data in the column will be lost.
  - You are about to drop the column `color_code` on the `RolyVariant` table. All the data in the column will be lost.
  - You are about to drop the column `color_name` on the `RolyVariant` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `RolyVariant` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `RolyVariant` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `RolyVariant` table. All the data in the column will be lost.
  - You are about to drop the `RolyImages` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[productId,colorCode,sizeCode]` on the table `RolyVariant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `RolyProduct` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sku` to the `RolyVariant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `RolyVariant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `variantId` to the `RolyVariant` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "RolyImages" DROP CONSTRAINT "RolyImages_productId_fkey";

-- DropIndex
DROP INDEX "RolyVariant_productId_colorProductId_size_key";

-- AlterTable
ALTER TABLE "RolyProduct" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "displayName" TEXT,
ADD COLUMN     "family" TEXT,
ADD COLUMN     "familyCode" TEXT,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "genderCode" TEXT,
ADD COLUMN     "observations" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "RolyVariant" DROP CONSTRAINT "RolyVariant_pkey",
DROP COLUMN "colorProductId",
DROP COLUMN "color_code",
DROP COLUMN "color_name",
DROP COLUMN "id",
DROP COLUMN "name",
DROP COLUMN "size",
ADD COLUMN     "barcode" TEXT,
ADD COLUMN     "colorCode" TEXT,
ADD COLUMN     "colorName" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "rawName" TEXT,
ADD COLUMN     "sizeCode" TEXT,
ADD COLUMN     "sizeLabel" TEXT,
ADD COLUMN     "sizeValue" TEXT,
ADD COLUMN     "sku" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "variantId" TEXT NOT NULL,
ADD CONSTRAINT "RolyVariant_pkey" PRIMARY KEY ("variantId");

-- AlterTable
ALTER TABLE "Variant" ADD COLUMN     "category" TEXT;

-- DropTable
DROP TABLE "RolyImages";

-- CreateTable
CREATE TABLE "RolyImage" (
    "id" SERIAL NOT NULL,
    "productId" TEXT NOT NULL,
    "colorCode" TEXT,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RolyImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RolyImage_productId_idx" ON "RolyImage"("productId");

-- CreateIndex
CREATE INDEX "RolyImage_productId_colorCode_idx" ON "RolyImage"("productId", "colorCode");

-- CreateIndex
CREATE UNIQUE INDEX "RolyImage_productId_colorCode_url_key" ON "RolyImage"("productId", "colorCode", "url");

-- CreateIndex
CREATE INDEX "RolyVariant_productId_colorCode_idx" ON "RolyVariant"("productId", "colorCode");

-- CreateIndex
CREATE INDEX "RolyVariant_productId_sizeCode_idx" ON "RolyVariant"("productId", "sizeCode");

-- CreateIndex
CREATE UNIQUE INDEX "RolyVariant_productId_colorCode_sizeCode_key" ON "RolyVariant"("productId", "colorCode", "sizeCode");

-- AddForeignKey
ALTER TABLE "RolyImage" ADD CONSTRAINT "RolyImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "RolyProduct"("productId") ON DELETE CASCADE ON UPDATE CASCADE;
