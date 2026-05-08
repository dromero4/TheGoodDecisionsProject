import getToken from "../../lib/Providers/roly/token.js";
import {getRolyProducts,  groupRolyProducts} from "../../lib/Providers/roly/products.js";

export default async function testRoly() {
    console.log("Testing Roly function");
    try {
        const token = await getToken();
        const products = await getRolyProducts(token);

        console.log("Roly Products:", products);
        
        const groupedProducts = groupRolyProducts(products);
        console.log("Grouped Roly Products:", JSON.stringify(groupedProducts, null, 2));

        return groupedProducts;

    } catch (error) {
        console.error("Error in testRoly function:", error);
        throw error;
    }
}

testRoly();