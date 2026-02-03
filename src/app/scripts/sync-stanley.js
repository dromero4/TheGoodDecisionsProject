import 'dotenv/config';

import { prisma } from "../lib/prisma.js";
import { getFullProductCatalog } from '../lib/stanley/index.js';

async function sync() {
    const products = await getFullProductCatalog();


    console.log(JSON.stringify(products[0], 2, null));

    console.log(products.length, "products to sync");

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