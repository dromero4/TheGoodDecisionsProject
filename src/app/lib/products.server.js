import { prisma } from "../lib/prisma.js";

export async function getProducts() {
    return await prisma.product.findMany({
        include: {
            images: true,
            variants: true,
        },
        orderBy: {
            id: "asc",
        }
    });
}

export async function getProductById(id) {
    return await prisma.product.findUnique({
        where: { externalId: id },
        include: {
            images: true,
            variants: {
                include: {
                    prices: true,
                },
            },
        },
    });
}