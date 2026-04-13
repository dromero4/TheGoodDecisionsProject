import { prisma } from "../../lib/prisma.js";

export async function getNormalizedRolyProducts() {
  const products = await prisma.rolyProduct.findMany({
    include: {
      images: true,
      variants: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return products.map((product) => ({
    id: `roly-${product.productId}`,
    name: product.displayName || product.name || "Unnamed product",
    image: product.images?.[0]?.url || null,
    href: `/product/roly/${product.productId}`,
    source: "roly",
  }));
}