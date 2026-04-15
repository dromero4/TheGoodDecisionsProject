export class CatalogRepository {
    /**
     * @returns {Promise<Catalog>}
     */
    async getCatalog() {
        throw new Error("CatalogRepository.getCatalog must be implemented");
    }
}
