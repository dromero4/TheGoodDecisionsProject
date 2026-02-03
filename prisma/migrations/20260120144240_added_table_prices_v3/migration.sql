/*
  Warnings:

  - You are about to drop the `Prices` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Prices";

-- CreateTable
CREATE TABLE "Price" (
    "id" SERIAL NOT NULL,
    "variantId" INTEGER NOT NULL,
    "unit" DOUBLE PRECISION NOT NULL,
    "gt10" DOUBLE PRECISION,
    "gt100" DOUBLE PRECISION,
    "gt500" DOUBLE PRECISION,
    "gt1000" DOUBLE PRECISION,

    CONSTRAINT "Price_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Price" ADD CONSTRAINT "Price_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "Variant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
