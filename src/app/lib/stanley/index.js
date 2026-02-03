import { GetStanleyImages } from "./images.js";
import { GetPrices } from "./prices.js";
import { GetStanleyProducts } from "./products.js";

export async function getFullProductCatalog() {
    const products = await GetStanleyProducts();
    const images = await GetStanleyImages();
    const prices = await GetPrices();

    //Images
    const imagesByStyleColor = {}

    for (const img of images) {
        const { code, colorCode, image } = img;

        if (!imagesByStyleColor[code]) {
            imagesByStyleColor[code] = {}
        }

        if (!imagesByStyleColor[code][colorCode]) {
            imagesByStyleColor[code][colorCode] = []
        }

        imagesByStyleColor[code][colorCode].push(image);
    }

    //Prices
    const priceBySku = {};

    for (const price of prices) {
        priceBySku[price.B2BSKUREF] = {
            unit: price.price_per_unit,
            gt10: price.price_gt_10,
            gt100: price.price_gt_100,
            gt500: price.price_gt_500,
            gt1000: price.price_gt_1000,
        };
    }

    const finalCatalog = products.map(product => ({
        ...product,
        variants: product.variants.map(variant => ({
            ...variant,
            images: imagesByStyleColor[product.code]?.[variant.colorCode] || [],
            price: priceBySku[variant.sku] ?? null
        })),
    }));

    return finalCatalog;
}