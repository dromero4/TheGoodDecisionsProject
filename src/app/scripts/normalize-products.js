import "dotenv/config";
import { prisma } from "../lib/prisma.js";

function extractImagesByColor(variants) {
    const imagesByColor = {};

    if (!Array.isArray(variants)) return imagesByColor;

    for (const variant of variants) {
        const color = variant.color;
        if (!color || !Array.isArray(variant.images)) continue;

        imagesByColor[color] ??= new Set();

        for (const url of variant.images) {
            imagesByColor[color].add(url);
        }
    }

    return imagesByColor;
}


async function normalize() {
    const raws = await prisma.rawProducts.findMany();

    console.log(raws.length, "raw products found");

    for (const raw of raws) {
        let i = 0;
        const data = raw.payload;

        // 1️⃣ Producto
        const product = await prisma.product.upsert({
            where: { externalId: raw.externalId },
            update: {
                name: data.name,
                shortDescription: data.variants[i].shortDescription ?? null,
                longDescription: data.variants[i].longDescription ?? null,
            },
            create: {
                externalId: raw.externalId,
                name: data.name,
                shortDescription: data.variants[i].shortDescription ?? null,
                longDescription: data.variants[i].longDescription ?? null,
            },
        });



        // 2️⃣ Limpiamos relaciones antiguas
       
        await prisma.image.deleteMany({
            where: { productId: product.id },
        });
        
        await prisma.price.deleteMany({
            where: {
                variant: {
                    productId: product.id,
                },
            },
        });
        await prisma.variant.deleteMany({
            where: { productId: product.id },
        });



        // 3️⃣ Variantes (tallas)
        if (Array.isArray(data.variants)) {
            for (const v of data.variants) {
                const variant = await prisma.variant.create({
                    data: {
                        productId: product.id,
                        sku: v.sku,
                        size: v.size,
                        color: v.color ?? null,
                    },
                });

                // Precio (solo si existe y es válido)
                if (v.price && typeof v.price.unit === "number") {
                    await prisma.price.upsert({
                        where: {
                            variantId: variant.id,
                        },
                        update: {
                            unit: v.price.unit,
                            gt10: v.price.gt10,
                            gt100: v.price.gt100,
                            gt500: v.price.gt500,
                            gt1000: v.price.gt1000,
                        },
                        create: {
                            variantId: variant.id,
                            unit: v.price.unit,
                            gt10: v.price.gt10,
                            gt100: v.price.gt100,
                            gt500: v.price.gt500,
                            gt1000: v.price.gt1000,
                        },
                    });
                }
            }
        }


        // 4️⃣ Imágenes
        const imagesByColor = extractImagesByColor(data.variants);

        for (const [color, urls] of Object.entries(imagesByColor)) {
            for (const url of urls) {
                await prisma.image.create({
                    data: {
                        productId: product.id,
                        url,
                        color,
                        type: "gallery",
                    },
                });
            }
        }
    }
}

normalize()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
