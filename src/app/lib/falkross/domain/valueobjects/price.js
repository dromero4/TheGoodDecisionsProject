export class Price {
    constructor({sku, defaultPrice, price, currency}) {
        this.sku = sku ?? "";
        this.defaultPrice = defaultPrice ?? 0.0;
        this.price = price ?? 0.0;
        this.currency = currency ?? "";
    }
}
