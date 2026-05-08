import FRProducts from "../../lib/Providers/F&R/test.js";

async function testing() {
    try {
        const products = await FRProducts();
        console.log("Products retrieved:", JSON.stringify(products, null, 2));
    } catch (error){
        console.error("Error in test function:", error);
        throw error;
    }
}

testing();