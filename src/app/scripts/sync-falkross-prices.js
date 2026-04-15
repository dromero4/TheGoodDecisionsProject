import "dotenv/config";
import {HttpCatalogRepository} from "../lib/falkross/infrastructure/http/catalog-repository.js";
import {HttpProductRepository} from "../lib/falkross/infrastructure/http/product-repository.js";
import {PrismaProductStoreRepository} from "../lib/falkross/infrastructure/prisma/product-store-repository.js";
import {ProductService} from "../lib/falkross/application/services/product-service.js";
import {HttpPriceRepository} from "../lib/falkross/infrastructure/http/price-repository.js";

async function syncPrices() {
    const catalogRepo = new HttpCatalogRepository;
    const productRepo = new HttpProductRepository;
    const productStoreRepo = new PrismaProductStoreRepository;
    const priceRepo = new HttpPriceRepository;

    const service = new ProductService({
        catalogRepository: catalogRepo,
        productRepository: productRepo,
        priceRepository: priceRepo,
        productStoreRepository: productStoreRepo,
    });

    const res = await service.syncPrices();

    // TODO replace with telemetry in production
    const prices = Array.isArray(res) ? res : [];
    console.table(
        prices.map((price) => ({
            sku: price.sku,
            defaultPrice: price.defaultPrice,
            price: price.price,
            currency: price.currency,
        }))
    );
}

syncPrices().catch(err => {
    console.error(err);
    process.exitCode = 1;
});
