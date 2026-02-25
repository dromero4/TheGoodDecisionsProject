import 'dotenv/config';

import { prisma } from "../lib/prisma.js";
import { getFullProductCatalog } from '../lib/stanley/index.js';

async function sync() {
    const products = await getFullProductCatalog();

    console.log(products.length, "products to sync");

    // console.log(allProducts);

    for (const p of products) {
        
        await prisma.rawProducts.upsert({
            where: {
                externalId: p.code
            },
            update: {
                payload: p
            },
            create: {
                externalId: p.code,
                payload: p,
            }
        });
    }
}

sync();