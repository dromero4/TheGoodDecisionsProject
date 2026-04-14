import "dotenv/config";

import getProduct from "../lib/falkross/index.js";
import {prisma} from "../lib/prisma.js";

function parseProductId(productId) {
    const [catalogId, externalId] = productId.split("//");

    if (!catalogId || !externalId) {
        throw new Error(`Invalid productId format: ${productId}`);
    }

    return {catalogId, externalId};
}

function toArray(value) {
    if (Array.isArray(value)) return value;
    if (value == null) return [];
    return [value];
}

async function sync() {
    const productId = "R000-011//99967";
    const {externalId} = parseProductId(productId);
    const product = await getProduct(productId);

    const style = product?.style_list?.style;
    const shortDescription = style?.style_name?.language?.en?.$t ?? null;
    const longDescription = style?.style_description?.language?.en?.$t ?? null;
    const skuList = toArray(style?.sku_list?.sku);

    await prisma.fallkRossProducts.upsert({
        where: {productId},
        update: {
            externalId,
            shortDescription,
            longDescription,
        },
        create: {
            productId,
            externalId,
            shortDescription,
            longDescription,
        },
    });

    for (const skuItem of skuList) {
        console.log(skuItem);

        const sku = skuItem?.sku_ean?.$t ?? null;
        const size = skuItem?.sku_size_name?.$t;
        const color = skuItem?.sku_color_name?.$t ?? null;
        const image = skuItem?.sku_color_picture_url.$t ?? null;

        if (!size) continue;

        await prisma.falkRossVariant.upsert({
            where: {
                productId_size_color_sku: {
                    productId,
                    size,
                    color,
                    sku,
                },
            },
            update: {},
            create: {
                productId,
                sku,
                color,
                size,
            },
        });

        await prisma.falkRossImage.upsert({
            where: {
                productId_sku_color: {
                    productId,
                    sku,
                    color,
                },
            },
            update: {},
            create: {
                productId,
                sku,
                color,
                url: image,
            },
        });
    }
}

sync()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
