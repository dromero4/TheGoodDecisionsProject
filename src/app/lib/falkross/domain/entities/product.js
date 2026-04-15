export class Product {
    constructor(url) {

        this.url = url
        this.productId = this.getProductIdByURL(url);
        let res = this.getCatalogAndSupplierByProductID(this.productId)
        this.catalogId = res.catalogId;
        this.supplierId = res.supplierId;
        this.shortDescription = "";
        this.longDescription = "";
        this.variants = [];
    }

    addVariant(variant) {
        this.variants.push(variant);
    }

    addShortDescription(shortDescription) {
        this.shortDescription = shortDescription;
    }

    addLongDescription(longDescription) {
        this.longDescription = longDescription;
    }

    getProductIdByURL() {
        const url = new URL(this.url);
        const parts = url.pathname.split("/");
        const trimmed = parts[4].endsWith(".json") ? parts[4].slice(0, -5) : parts[4];

        return parts[2] + "//" + trimmed;
    }

    getUrlByProductId() {
        const [catalogId, jsonId] = this.productId.split("//");

        if (!catalogId || !jsonId) {
            throw new Error(`Invalid productId format: ${this.productId}`);
        }

        return `https://download.falk-ross.eu/ws/${catalogId}/json/${jsonId}.json`;
    }

    getCatalogAndSupplierByProductID(productId) {
        const [catalogId, supplierId] = productId.split("//");

        if (!catalogId || !supplierId) {
            throw new Error(`Invalid productId format: ${productId}`);
        }

        return {catalogId, supplierId};
    }


}
