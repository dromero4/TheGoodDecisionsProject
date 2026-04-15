export class PriceRepository {
    /**
     * @returns {Promise<Price[]>}
     */
    async getAll() {
        throw new Error("PriceRepository.getAll must be implemented");
    }
}