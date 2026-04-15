import "dotenv/config";
import {HttpCatalogRepository} from "../lib/falkross/infrastructure/http/catalog-repository.js";
import {HttpProductRepository} from "../lib/falkross/infrastructure/http/product-repository.js";
import {PrismaProductStoreRepository} from "../lib/falkross/infrastructure/prisma/product-store-repository.js";
import {ProductService} from "../lib/falkross/application/services/product-service.js";


async function sync() {
    const catalogRepo = new HttpCatalogRepository;
    const productRepo = new HttpProductRepository;
    const productStoreRepo = new PrismaProductStoreRepository;


    const service = new ProductService({
        catalogRepository: catalogRepo,
        productRepository: productRepo,
        productStoreRepository: productStoreRepo,
    });

    const res = await service.syncCatalog();

    const products = Array.isArray(res) ? res : [];

    // TODO replace with telemetry in production
    console.log(`products synced: ${products.length}`);
    console.table(
        products.map((product) => ({
            productId: product.productId,
            externalId: product.externalId,
            shortDescription: product.shortDescription,
        }))
    );
}

sync().catch(err => {
    console.error(err);
    process.exitCode = 1;
});
