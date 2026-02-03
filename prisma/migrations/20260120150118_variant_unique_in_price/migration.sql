/*
  Warnings:

  - A unique constraint covering the columns `[variantId]` on the table `Price` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Price_variantId_key" ON "Price"("variantId");
