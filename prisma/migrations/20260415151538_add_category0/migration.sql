/*
  Warnings:

  - You are about to drop the column `category` on the `Variant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "category" TEXT;

-- AlterTable
ALTER TABLE "Variant" DROP COLUMN "category";
