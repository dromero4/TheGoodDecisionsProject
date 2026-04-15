export class Product {
    constructor(url) {
        this.url = url
        this.productId = this.getProductIdByURL(url);
        this.shortDescription = "";
        this.longDescription = "";
        this.variants = [];
        this.images = [];
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
        return parts[4].endsWith(".json") ? parts[4].slice(0, -5) : parts[4];
    }
}
