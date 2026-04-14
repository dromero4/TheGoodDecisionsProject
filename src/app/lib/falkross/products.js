import {prisma} from "@/app/lib/prisma.js";

async function saveToDB(items) {
    await prisma.$transaction(async (tx) => {
        for (const item of items) {
            const externalId = getExternalId(item);
            if (!externalId) continue;

            await tx.FolkRossProducts.upsert({
                where: {externalId},
                update: {payload: item,},
                create: {externalId, payload: item},
            });
        }
    });
}

function getExternalId(item) {
    return String(item?.catalogReference ?? item?.supplierReference ?? "").trim();
}