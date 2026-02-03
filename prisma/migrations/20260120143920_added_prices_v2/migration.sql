/*
  Warnings:

  - You are about to drop the column `price` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "price";

-- CreateTable
CREATE TABLE "Prices" (
    "id" SERIAL NOT NULL,
    "sku" TEXT NOT NULL,
    "unit" DOUBLE PRECISION NOT NULL,
    "gt10" DOUBLE PRECISION NOT NULL,
    "gt100" DOUBLE PRECISION NOT NULL,
    "gt500" DOUBLE PRECISION NOT NULL,
    "gt1000" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Prices_pkey" PRIMARY KEY ("id")
);
