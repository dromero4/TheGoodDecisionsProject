import { prisma } from "../../lib/prisma.js";
import getToken from "../../lib/roly/token.js";
import { getRolyProducts, groupRolyProducts } from "../../lib/roly/products.js";

export default async function syncRoly() {
  console.log("Starting Roly sync...");

  try {
    const token = await getToken();
    const products = await getRolyProducts(token);
    const groupedProducts = groupRolyProducts(products);

    let totalProducts = 0;
    let totalVariants = 0;

    for (const product of groupedProducts) {
      await prisma.rolyProduct.upsert({
        where: {
          productId: product.productId,
        },
        update: {
          name: product.name,
          displayName: product.displayName ?? null,
          description: product.description ?? null,
          weight: product.weight ?? null,
          family: product.family ?? null,
          familyCode: product.familyCode ?? null,
          gender: product.gender ?? null,
          genderCode: product.genderCode ?? null,
          observations: product.observations ?? null,
        },
        create: {
          productId: product.productId,
          name: product.name,
          displayName: product.displayName ?? null,
          description: product.description ?? null,
          weight: product.weight ?? null,
          family: product.family ?? null,
          familyCode: product.familyCode ?? null,
          gender: product.gender ?? null,
          genderCode: product.genderCode ?? null,
          observations: product.observations ?? null,
        },
      });

      totalProducts++;

      for (const variant of product.variants) {
        await prisma.rolyVariant.upsert({
          where: {
            variantId: variant.variantId,
          },
          update: {
            productId: product.productId,
            sku: variant.sku,
            barcode: variant.barcode ?? null,
            sizeCode: variant.sizeCode ?? null,
            sizeLabel: variant.sizeLabel ?? null,
            sizeValue: variant.sizeValue ?? null,
            colorCode: variant.colorCode ?? null,
            colorName: variant.colorName ?? null,
            rawName: variant.rawName ?? null,
          },
          create: {
            variantId: variant.variantId,
            productId: product.productId,
            sku: variant.sku,
            barcode: variant.barcode ?? null,
            sizeCode: variant.sizeCode ?? null,
            sizeLabel: variant.sizeLabel ?? null,
            sizeValue: variant.sizeValue ?? null,
            colorCode: variant.colorCode ?? null,
            colorName: variant.colorName ?? null,
            rawName: variant.rawName ?? null,
          },
        });

        totalVariants++;
      }
    }

    console.log(`Roly sync completed`);
    console.log(`Products synced: ${totalProducts}`);
    console.log(`Variants synced: ${totalVariants}`);

    return {
      ok: true,
      totalProducts,
      totalVariants,
    };
  } catch (error) {
    console.error("Error syncing Roly:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

syncRoly();