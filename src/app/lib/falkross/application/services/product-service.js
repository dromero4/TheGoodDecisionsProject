export class ProductService {
    constructor({catalogRepository, productRepository, productStoreRepository, priceRepository}) {
        this.catalogRepository = catalogRepository;
        this.productRepository = productRepository;
        this.productStoreRepository = productStoreRepository;
        this.priceRepository = priceRepository;
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

    async syncPrices({batchSize = 100} = {}) {
        if (!this.priceRepository) {
            return [];
        }

        const prices = await this.priceRepository.getAll();
        const items = Array.isArray(prices) ? prices : [];

        if (!this.productStoreRepository) {
            return items;
        }

        const allSaved = [];

        for (let i = 0; i < items.length; i += batchSize) {
            const batch = items.slice(i, i + batchSize);
            const saved = await this.productStoreRepository.updatePrices(batch);
            allSaved.push(...(Array.isArray(saved) ? saved : []));
        }

        return allSaved;
    }
}
