import {prisma} from "../../../prisma.js";
import {ProductStoreRepository} from "../../domain/repositories/product-store-repository.js";

export class PrismaProductStoreRepository extends ProductStoreRepository {
    async createWithVariants(product) {
        return prisma.$transaction(async (tx) => {
            const p = await tx.fallkRossProducts.upsert({
                where: {productId: product.productId},
                update: {
                    shortDescription: product.shortDescription,
                    longDescription: product.longDescription,
                },
                create: {
                    productId: product.productId,
                    shortDescription: product.shortDescription,
                    longDescription: product.longDescription,
                },
            });

            const variants = (product.variants ?? []).filter((i) =>
                typeof i?.sku === "string" &&
                typeof i?.size === "string" &&
                typeof i?.color === "string"
            );

            if (variants.length > 0) {
                await tx.falkRossVariant.createMany({
                    data: variants.map((i) => ({
                        productId: product.productId,
                        sku: i.sku,
                        color: i.color,
                        size: i.size,
                    })),
                    skipDuplicates: true,
                });
            }

            const images = variants.filter(
                (i) => typeof i?.image === "string" && i.image.trim().length > 0
            );

            if (images.length > 0) {
                await tx.falkRossImage.createMany({
                    data: images.map((i) => ({
                        productId: product.productId,
                        sku: i.sku,
                        color: i.color,
                        url: i.image.trim(),
                    })),
                    skipDuplicates: true,
                });
            }

            return p
        });
    }
}
