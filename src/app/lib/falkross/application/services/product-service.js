export class ProductService {
    constructor({ catalogRepository, productRepository, productStoreRepository }) {
        this.catalogRepository = catalogRepository;
        this.productRepository = productRepository;
        this.productStoreRepository = productStoreRepository;
    }

    async syncCatalog({batchSize = 100} = {}) {
        const catalog = await this.catalogRepository.getCatalog();

        const items = Array.isArray(catalog.products) ? catalog.products : [];
        const allSaved = [];

        for (let i = 0; i < items.length; i += batchSize) {
            const batch = items.slice(i, i + batchSize);
            const products = [];

            for (const url of batch) {
                if (!url) continue;

                const product = await this.productRepository.getProductByURL(url);
                products.push(product);
            }

            const saved = await this.persistProducts(products);
            allSaved.push(...saved);
        }

        return allSaved;
    }

    async persistProducts(products) {
        if (!Array.isArray(products) || products.length === 0) {
            return [];
        }

        if (!this.productStoreRepository) {
            return products;
        }

        const saved = [];

        for (const product of products) {
            const result = await this.productStoreRepository.createWithVariants(product);
            saved.push(result);
        }

        return saved;
    }
}
