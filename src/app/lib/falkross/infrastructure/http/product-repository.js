import {Product} from "../../domain/entities/product.js";
import {ProductRepository} from "../../domain/repositories/product-repository.js";
import {Variant} from "../../domain/valueobjects/variant.js";
import {Image} from "../../domain/valueobjects/image.js";

export class HttpProductRepository extends ProductRepository {
    async getProductByURL(url) {
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`failed to fetch product: ${res.status}`);
        }

        const data = await res.json();

        const style = data?.style_list?.style;

        let product = new Product(url);
        product.addShortDescription(style?.style_name?.language?.en?.$t ?? null);
        product.addLongDescription(style?.style_description?.language?.en?.$t ?? null);

        const rawSkuList = style?.sku_list?.sku;
        const skuList = Array.isArray(rawSkuList)
            ? rawSkuList
            : rawSkuList
                ? [rawSkuList]
                : [];

        for (const skuItem of skuList) {
            const variant = new Variant({
                productId: product.productId,
                sku: skuItem?.sku_artnum?.$t,
                size: skuItem?.sku_size_name?.$t,
                color: skuItem?.sku_color_name?.$t,
            })


            const image = new Image({
                productId: product.productId,
                sku: variant.sku,
                url: skuItem?.sku_color_picture_url?.$t,
            })

            product.variants.push(variant);
            product.images.push(image);
        }

        return product;
    }
}
