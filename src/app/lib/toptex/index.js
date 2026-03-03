import { getAllProducts } from "./products.js";

export default async function getFullToptexProductCatalog() {
    try {
        const products = await getAllProducts();

        console.log("Toptex products:", products.length);
    } catch (error) {
        console.error("Error fetching Toptex product catalog:", error);
        throw error;
    }
}