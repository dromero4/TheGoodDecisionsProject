import axios from "axios";

function ensureArray(x) {
  if (!x) return [];
  if (Array.isArray(x)) return x;
  if (typeof x === "object") return [x];
  return [];
}

// Extrae talla de nombres tipo: " ... SHOES S/41 EBONY/TURQUOISE"
function extractSizeFromName(name) {
  const s = String(name || "");

  // patrón zapatos S/41, S/42, etc
  const mShoe = s.match(/\bS\/(\d+(?:\.\d+)?)\b/i);
  if (mShoe) return mShoe[1];

  // patrón ropa al final: XS S M L XL XXL 3XL...
  const mApparel = s.match(/\b(XXS|XS|S|M|L|XL|XXL|3XL|4XL|5XL)\b/i);
  if (mApparel) return mApparel[1].toUpperCase();

  // fallback
  return "U";
}

// Intenta sacar “modelo” desde itemcode (para agrupar)
// Ej: ZS8335Z4123112 -> modelo "ZS8335Z" + size "41" + color "23112"
function extractModelFromItemcode(itemcode) {
  const code = String(itemcode || "");
  const m = code.match(/^(.*?Z)\d{2,3}\d{5}$/i); 
  // explicación: "....Z" + talla(2-3) + color(5)
  // si no cuadra, devolvemos todo menos el final de color(5)
  if (m) return m[1];
  if (code.length > 5) return code.slice(0, -5);
  return code;
}

export default async function getProducts(token) {
  const { data } = await axios.get(process.env.ROLY_API_URL, {
    headers: { Authorization: `Bearer ${token}` },
    params: { brand: "roly", lang: "en-US" },
  });

  const items = ensureArray(data?.item ?? data?.items ?? data?.data?.item ?? data?.data?.items);

  const map = new Map();

  for (const it of items) {
    const sku = it.itemcode;
    if (!sku) continue;

    const colorCode = String(it.colorcode ?? "");
    const model = extractModelFromItemcode(sku);
    const productId = `${model}-${colorCode}`; // ✅ agrupador

    if (!map.has(productId)) {
      map.set(productId, {
        product_id: productId,                 // <-- ahora es “producto”
        product_name: it.itemname ?? "",
        product_description: it.description ?? null,
        product_color_code: colorCode,
        product_color_name: it.colorname ?? "",
        product_weight: it.weight ?? 0,
        product_viewsimages: String(it.viewsimages ?? "")
          .split(",")
          .map((u) => u.trim())
          .filter(Boolean),
        variants: [],
      });
    }

    map.get(productId).variants.push({
      sku: String(sku),
      size: extractSizeFromName(it.itemname),
      name: it.itemname ?? "",
    });
  }

  return Array.from(map.values());
}