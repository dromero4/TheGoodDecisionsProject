export class ProductStoreRepository {
    async createWithVariants(_product) {
        throw new Error("ProductStoreRepository.createWithVariants must be implemented");
    }

    async updatePrices(_price) {
        throw new Error("ProductStoreRepository.updatePrice must be implemented");
    }
}
