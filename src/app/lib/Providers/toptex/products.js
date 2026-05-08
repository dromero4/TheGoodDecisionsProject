import axios from "axios";
import dotenv from "dotenv";
import authenticate from "./auth.js";
import { prisma } from "../../prisma.js";

dotenv.config();

const BASE = process.env.TOPTEX_ENDPOINT.replace(/\/+$/, "");

export async function getProductsPage(page = 1, pageSize = 50) {
  const token = await authenticate();

  const { data } = await axios.get(`${BASE}/v3/products/all`, {
    headers: {
      "x-toptex-authorization": token,
      "x-api-key": process.env.TOPTEX_API_KEY,
      Accept: "application/json",
    },
    params: {
      usage_right: "b2b_uniquement",
      page_number: page,
      page_size: pageSize,
    },
    timeout: 120000,
  });

  // 👇 normalizamos el shape
  return {
    items: data?.items ?? [],
    totalCount: data?.total_count ?? null,
  };
}

export async function getAllProducts({ pageSize = 50 } = {}) {
  let page = 1;
  const all = [];
  let totalCount = null;

  let prevFirstId = null;

  while (true) {
    const { items, totalCount: tc } = await getProductsPage(page, pageSize);
    if (totalCount == null && tc != null) totalCount = tc;

    const firstId = items?.[0]?.catalogReference ?? items?.[0]?.supplierReference ?? null;
    const lastId  = items?.at(-1)?.catalogReference ?? items?.at(-1)?.supplierReference ?? null;

    console.log(
      `page=${page} items=${items.length} first=${firstId} last=${lastId} total=${totalCount}`
    );

    // Si una página viene vacía ANTES de llegar al total, NO es "fin", es fallo de paginación
    if (!items.length) {
      throw new Error(`Page ${page} returned 0 items but totalCount=${totalCount} and all=${all.length}`);
    }

    // Si repite primera ID, es que NO está avanzando página (param mal o API lo ignora)
    if (prevFirstId && prevFirstId === firstId) {
      throw new Error(`Pagination not advancing. Page ${page} repeats firstId=${firstId}`);
    }
    prevFirstId = firstId;

    await savePageToDB(items);

    all.push(...items);

    if (totalCount != null && all.length >= totalCount) break;

    page++;
  }

  console.log("Fetched", all.length, "of", totalCount);
  return all;
}

function getExternalId(item) {
  return String(item?.catalogReference ?? item?.supplierReference ?? "").trim();
}

async function savePageToDB(items) {
  // transacción por página (más rápido y consistente)
  await prisma.$transaction(async (tx) => {
    for (const item of items) {
      const externalId = getExternalId(item);
      if (!externalId) continue;

      await tx.rawTopTexProducts.upsert({
        where: { externalId },
        update: { payload: item, source: "toptex" },
        create: { externalId, payload: item, source: "toptex" },
      });
    }
  });
}