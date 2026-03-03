function cleanStr(x) {
  const s = String(x ?? "").trim();
  return s ? s : null;
}

function pickLang(obj, lang = "es") {
  if (!obj || typeof obj !== "object") return null;
  return cleanStr(obj[lang]) || cleanStr(obj.en) || cleanStr(obj.es) || null;
}

function parseEuro(x) {
  // "11,02 €" -> 11.02
  const s = cleanStr(x);
  if (!s) return null;
  const n = Number(s.replace(/\s*€\s*/g, "").replace(/\./g, "").replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

function pickProductImage(payload) {
  // 1) imagen general si existe
  const general = payload?.images?.[0]?.url_image || payload?.images?.[0]?.url;
  if (general) return general;

  // 2) si no, primer packshot disponible
  const firstColor = payload?.colors?.[0];
  if (firstColor?.packshots) {
    for (const v of Object.values(firstColor.packshots)) {
      const u = v?.url_packshot || v?.url;
      if (u) return u;
    }
  }
  return null;
}

export function normalizeToptexProduct(payload, lang = "es") {
  const id = cleanStr(payload?.catalogReference) || cleanStr(payload?.supplierReference);
  if (!id) return null;

  const name = pickLang(payload.designation, lang) || pickLang(payload.designation, "en");
  const description = pickLang(payload.description, lang) || pickLang(payload.description, "en");

  // Colores / variantes (para listados suele bastar con colores e imagen)
  const colors = [];
  let minPrice = null;
  let maxPrice = null;

  for (const c of payload.colors || []) {
    const colorName = pickLang(c.colors, lang) || pickLang(c.colors, "en");
    const hexa = cleanStr((c.colorsHexa || [])[0]) || null;

    // imagen de color (packshot)
    let image = null;
    if (c.packshots) {
      // prioriza FACE SIDE si existe
      const face = c.packshots["FACE SIDE"];
      image = face?.url_packshot || face?.url || null;

      if (!image) {
        for (const v of Object.values(c.packshots)) {
          const u = v?.url_packshot || v?.url;
          if (u) { image = u; break; }
        }
      }
    }

    // precios (si quieres mostrar “desde X€”)
    for (const s of c.sizes || []) {
      const p = parseEuro(s.publicUnitPrice);
      if (p != null) {
        minPrice = minPrice == null ? p : Math.min(minPrice, p);
        maxPrice = maxPrice == null ? p : Math.max(maxPrice, p);
      }
    }

    colors.push({
      name: colorName,
      hexa,
      image,
      // opcional: para tu selector
      colorCode: cleanStr(c?.sizes?.[0]?.colorCode),
    });
  }

  return {
    id,                          // catalogReference (B050)
    brand: cleanStr(payload.brand),
    name,
    description,
    family: pickLang(payload.family, lang) || pickLang(payload.family, "en"),
    subFamily: pickLang(payload.sub_family, lang) || pickLang(payload.sub_family, "en"),
    labelType: cleanStr(payload.labelType),
    composition: pickLang(payload.composition, lang) || pickLang(payload.composition, "en"),
    image: pickProductImage(payload), // imagen principal para card
    colors,
    price: {
      min: minPrice,
      max: maxPrice,
    },
    // si algún día quieres mostrar “tallas disponibles”
    sizes: Array.from(
      new Set(
        (payload.colors || []).flatMap((c) => (c.sizes || []).map((s) => cleanStr(s.size)).filter(Boolean))
      )
    ),
    rawLastChange: cleanStr(payload.lastChange),
  };
}