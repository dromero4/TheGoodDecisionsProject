export class Image {
    constructor({sku, productId, image, url}) {
        this.productId = productId;
        this.sku = typeof sku === "string" ? sku.trim() : "";
        const source = typeof url === "string" ? url : image;
        this.url = typeof source === "string" ? source.trim() : "";
    }
}
