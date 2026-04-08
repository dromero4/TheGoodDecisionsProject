
import { prisma } from "../../lib/prisma.js";
import { normalizeToptexProduct } from "./normalize-toptex.js";

export async function getNormalizedToptexProducts({
  lang = "en",
  take = 2999,
  skip = 0,
} = {}) {
  const rows = await prisma.rawTopTexProducts.findMany({
    skip,
    take,
    orderBy: { externalId: "asc" }, // o updatedAt desc si quieres
    select: {
      externalId: true,
      payload: true,
    },
  });

  const products = rows
    .map((r) => normalizeToptexProduct(r.payload, lang))
    .filter(Boolean);

  return products;
}