-- AlterTable
ALTER TABLE "RolyVariant" ADD COLUMN     "color_code" INTEGER,
ADD COLUMN     "color_name" TEXT;

-- CreateIndex
CREATE INDEX "RolyVariant_productId_color_code_idx" ON "RolyVariant"("productId", "color_code");
