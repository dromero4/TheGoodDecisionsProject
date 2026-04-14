import axios from "axios";

export async function getRolyProducts(token) {
    try {
        const response = await axios.get("https://clientsws.gorfactory.es:2096/api/v1/item/getcatalog", {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                lang: "en-US",
                brand: "roly",
            }

        });
        return response.data.item;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
}

function extractDisplayName(itemName, modelName) {
  if (!itemName) return modelName || "";

  const cleaned = String(itemName)
    .replace(/\sS\/[A-Z0-9.]+\s+.+$/i, "")
    .trim();

  return cleaned || modelName || "";
}

function extractSizeValue(sizeName, itemName) {
  if (sizeName) {
    const match = String(sizeName).match(/(\d+(?:[.,]\d+)?|[A-Z]+)$/i);
    if (match) return match[1];
  }

  if (itemName) {
    const match = String(itemName).match(/S\/([A-Z0-9.]+)/i);
    if (match) return match[1];
  }

  return null;
}
function extractColorName(product) {
  if (product.colorname) return product.colorname;

  if (!product.itemname) return null;

  const match = String(product.itemname).match(/S\/[A-Z0-9.]+\s+(.+)$/i);
  return match ? match[1].trim() : null;
}


export function groupRolyProducts(products) {
  const grouped = new Map();

  for (const product of products) {
    const productId = product.modelcode;
    if (!productId) continue;

    if (!grouped.has(productId)) {
      grouped.set(productId, {
        productId,
        supplier: "roly",
        name: product.modelname || "",
        displayName: extractDisplayName(product.itemname, product.modelname),
        description: product.description ?? null,
        family: product.family ?? null,
        familyCode: product.familycode ?? null,
        gender: product.gender ?? null,
        genderCode: product.gendercode ?? null,
        variants: [],
      });
    }

    grouped.get(productId).variants.push({
      variantId: product.itemcode,
      sku: product.itemcode,
      barcode: product.eancode ?? null,
      sizeCode: product.sizecode ?? null,
      sizeLabel: product.sizename ?? null,
      sizeValue: extractSizeValue(product.sizename, product.itemname),
      colorCode: product.colorcode ?? null,
      colorName: extractColorName(product),
      rawName: product.itemname ?? null,
    });
  }

  return Array.from(grouped.values());
}