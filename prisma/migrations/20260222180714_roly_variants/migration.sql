-- CreateTable
CREATE TABLE "RolyProduct" (
    "productId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "color_code" INTEGER NOT NULL,
    "color_name" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "RolyProduct_pkey" PRIMARY KEY ("productId")
);

-- CreateTable
CREATE TABLE "RolyVariant" (
    "sku" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "RolyVariant_pkey" PRIMARY KEY ("sku")
);

-- CreateTable
CREATE TABLE "RolyImages" (
    "id" SERIAL NOT NULL,
    "productId" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "RolyImages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RolyVariant_productId_idx" ON "RolyVariant"("productId");

-- CreateIndex
CREATE INDEX "RolyImages_productId_idx" ON "RolyImages"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "RolyImages_productId_url_key" ON "RolyImages"("productId", "url");

-- AddForeignKey
ALTER TABLE "RolyVariant" ADD CONSTRAINT "RolyVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "RolyProduct"("productId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolyImages" ADD CONSTRAINT "RolyImages_productId_fkey" FOREIGN KEY ("productId") REFERENCES "RolyProduct"("productId") ON DELETE CASCADE ON UPDATE CASCADE;
