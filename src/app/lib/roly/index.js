import getAuthToken from "./authToken.js";
import getPrices from "./prices.js";
import getProducts from "./products.js";

function toArray(x) {
  if (!x) return [];
  if (Array.isArray(x)) return x;

  // patrones típicos de APIs / axios
  if (Array.isArray(x.item)) return x.item;
  if (Array.isArray(x.items)) return x.items;

  if (x.data) {
    if (Array.isArray(x.data)) return x.data;
    if (Array.isArray(x.data.item)) return x.data.item;
    if (Array.isArray(x.data.items)) return x.data.items;
  }

  return [];
}

export async function getFullROLYProductCatalog() {
  const token = await getAuthToken();

  const productsRaw = await getProducts(token);
  const pricesRaw = await getPrices(token);

  const products = toArray(productsRaw);
  const prices = toArray(pricesRaw);

  console.log("ROLY products:", products.length);
  console.log("ROLY prices:", prices.length);

  const priceBySku = {};

  for (const p of prices) {
    const sku = p.productcode;
    if (!sku) continue;

    priceBySku[sku] = {
      unit: p.price_unit,
      pack: p.price_pack,
      box: p.price_box,
      pvp: p.price_unit_pvp,
      currency: p.currency,
      packing: p.packing,
    };
  }

  const finalCatalog = products.map((product) => ({
    ...product,
    variants: (product.variants ?? []).map((variant) => ({
      ...variant,
      price: priceBySku[variant.sku] ?? null,
    })),
  }));

  return finalCatalog;
}