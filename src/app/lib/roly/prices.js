import axios from "axios";

function ensureArray(x) {
  if (!x) return [];
  if (Array.isArray(x)) return x;
  if (typeof x === "object") return [x]; // si viene un solo item como objeto
  return [];
}

export default async function getPrices(token) {
  if (!token) throw new Error("Auth token is undefined. Check getAuthToken() response parsing.");

  const body = new URLSearchParams({ brand: "roly" });

  const { data } = await axios.post(
    "https://clientsws.gorfactory.es:2096/api/v1/item/pricelist",
    body,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
    }
  );

  // ✅ soporta varios shapes
  const items = ensureArray(
    data?.item ??
    data?.items ??
    data?.data?.item ??
    data?.data?.items ??
    data?.pricelist
  );

  if (!items.length) {
    console.log("ROLY pricelist keys:", Object.keys(data || {}));
    console.log("ROLY pricelist data.item type:", typeof data?.pricelist);
    throw new Error("ROLY pricelist: no items array found in response");
  }

  const map = new Map();

  for (const product of items) {
    const sku = product.itemcode ?? product.productcode; // según endpoint
    if (!sku) continue;

    if (!map.has(sku)) {
      map.set(sku, {
        product_id: String(sku),
        price_unit: product.price_unit ?? null,
        price_pack: product.price_pack ?? null,
        price_box: product.price_box ?? null,
        price_unit_pvp: product.price_unit_pvp ?? null,
        currency: product.currency ?? null,
        packing: product.packing ?? null,
      });
    }
  }

  return Array.from(map.values());
}