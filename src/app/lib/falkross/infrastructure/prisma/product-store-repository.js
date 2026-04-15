import {prisma} from "../../../prisma.js";
import {ProductStoreRepository} from "../../domain/repositories/product-store-repository.js";

export class PrismaProductStoreRepository extends ProductStoreRepository {
    async createWithVariants(product) {
        return prisma.$transaction(async (tx) => {
            const p = await tx.fallkRossProducts.upsert({
                where: {productId: product.productId},
                update: {
                    externalId: product.supplierId,
                    shortDescription: product.shortDescription,
                    longDescription: product.longDescription,
                },
                create: {
                    productId: product.productId,
                    externalId: product.supplierId,
                    shortDescription: product.shortDescription,
                    longDescription: product.longDescription,
                },
            });

            const variants = (product.variants ?? []).filter((i) =>
                typeof i?.sku === "string" &&
                typeof i?.size === "string" &&
                typeof i?.color === "string"
            );

            await tx.falkRossVariant.createMany({
                data: variants.map((i) => ({
                    productId: product.productId,
                    sku: i.sku,
                    color: i.color,
                    size: i.size,
                })),
                skipDuplicates: true,
            });

            return p
        });
    }
}
