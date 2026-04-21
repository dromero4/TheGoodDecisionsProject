import { getProducts } from "../lib/products.server";
import { getNormalizedToptexProducts } from "../scripts/toptex/get-normalized-toptex";
import { getNormalizedRolyProducts } from "../scripts/roly/get-normalized-roly";
import ProductsPaginationClient from "../components/pageComponents/products/ProductsPaginationClient";

function normalizeStanley(products = []) {
  return products.map((product) => ({
    id: `stanley-${product.externalId}`,
    name: product.name,
    image: product.images?.[0]?.url || null,
    href: `/product/${product.externalId}`,
    source: "stanley",
    category: product.category,
  }));
}

function normalizeToptex(products = []) {
  return products.map((product, idx) => ({
    id: `toptex-${product.id ?? idx}`,
    name: product.name ?? "Unnamed product",
    image: product.image || null,
    href: null,
    source: "toptex",
  }));
}

export default async function Home() {
  const [stanleyProducts, toptexProducts, rolyProducts] = await Promise.all([
    getProducts(),
    getNormalizedToptexProducts(),
    getNormalizedRolyProducts(),
  ]);

  const allProducts = [
    ...normalizeStanley(stanleyProducts),
    ...normalizeToptex(toptexProducts),
    ...rolyProducts,
  ];

  return <ProductsPaginationClient products={allProducts} />;
}