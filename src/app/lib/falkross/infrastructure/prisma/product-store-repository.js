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

            const images = (product.images ?? []).filter((i) =>
                typeof i?.url === "string" &&
                i.url.length > 0
            );

            if (variants.length > 0) {
                await tx.falkRossVariants.createMany({
                    data: variants.map((i) => ({
                        productId: product.productId,
                        sku: i.sku,
                        color: i.color,
                        size: i.size,
                    })),
                    skipDuplicates: true,
                });
            }


            if (images.length > 0) {
                await tx.falkRossImages.createMany({
                    data: images.map((i) => ({
                        productId: product.productId,
                        sku: i.sku,
                        url: i.url,
                    })),
                    skipDuplicates: true,
                });
            }

            return p
        });
    }

    async updatePrices(prices) {
        return prisma.$transaction(async (tx) => {
            const toNumber = (value) => {
                const n = typeof value === "number" ? value : parseFloat(value);
                return Number.isFinite(n) ? n : 0;
            };

            const validPrices = (prices ?? []).filter((item) =>
                typeof item?.sku === "string" &&
                item.sku.length > 0 &&
                typeof item?.currency === "string" &&
                item.currency.length > 0
            );

            if (validPrices.length === 0) {
                return [];
            }

            const upserts = validPrices.map((item) => {
                const sku = item.sku;
                const defaultPrice = toNumber(item.defaultPrice);
                const price = toNumber(item.price);
                const currency = typeof item.currency === "string" ? item.currency : "";

                return tx.falkRossPrices.upsert({
                    where: {
                        sku_currency: {
                            sku,
                            currency,
                        },
                    },
                    update: {
                        default_price: defaultPrice,
                        price,
                    },
                    create: {
                        sku,
                        default_price: defaultPrice,
                        price,
                        currency,
                    },
                });
            });

            return Promise.all(upserts);
        });
    }
}
