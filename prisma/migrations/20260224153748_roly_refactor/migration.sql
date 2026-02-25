/*
  Warnings:

  - You are about to drop the column `baseProductId` on the `RolyProduct` table. All the data in the column will be lost.
  - You are about to drop the column `color_code` on the `RolyProduct` table. All the data in the column will be lost.
  - You are about to drop the column `color_name` on the `RolyProduct` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[colorProductId,url]` on the table `RolyImages` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[productId,colorProductId,size]` on the table `RolyVariant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `colorProductId` to the `RolyImages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `colorProductId` to the `RolyVariant` table without a default value. This is not possible if the table is not empty.
  - Made the column `color_code` on table `RolyVariant` required. This step will fail if there are existing NULL values in that column.
  - Made the column `color_name` on table `RolyVariant` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "RolyImages_productId_url_key";

-- DropIndex
DROP INDEX "RolyProduct_baseProductId_idx";

-- DropIndex
DROP INDEX "RolyVariant_productId_color_code_idx";

-- DropIndex
DROP INDEX "RolyVariant_productId_color_code_size_key";

-- AlterTable
ALTER TABLE "RolyImages" ADD COLUMN     "colorProductId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "RolyProduct" DROP COLUMN "baseProductId",
DROP COLUMN "color_code",
DROP COLUMN "color_name",
ALTER COLUMN "weight" DROP NOT NULL;

-- AlterTable
ALTER TABLE "RolyVariant" ADD COLUMN     "colorProductId" TEXT NOT NULL,
ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "color_code" SET NOT NULL,
ALTER COLUMN "color_name" SET NOT NULL;

-- CreateIndex
CREATE INDEX "RolyImages_productId_colorProductId_idx" ON "RolyImages"("productId", "colorProductId");

-- CreateIndex
CREATE UNIQUE INDEX "RolyImages_colorProductId_url_key" ON "RolyImages"("colorProductId", "url");

-- CreateIndex
CREATE UNIQUE INDEX "RolyVariant_productId_colorProductId_size_key" ON "RolyVariant"("productId", "colorProductId", "size");
