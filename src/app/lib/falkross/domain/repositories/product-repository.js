export class ProductRepository {
    /**
     * @returns {Promise<Product>}
     */
    async getProductByURL(_url) {
        throw new Error("ProductStoreRepository.getProductByURL must be implemented");
    }
}