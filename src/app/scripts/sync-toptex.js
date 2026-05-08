import getFullToptexProductCatalog from "../lib/Providers/toptex/index.js";

export default async function test() {
    const products = await getFullToptexProductCatalog();

    return products;
}

test();