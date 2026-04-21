// src/lib/personalization/shared/normalize.js

/**
 * Normaliza cualquier texto para comparar claves internas sin problemas:
 * - minúsculas
 * - sin tildes
 * - espacios limpios
 */
export function normalizeText(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\s+/g, " ");
}

/**
 * Convierte texto libre a una clave interna segura.
 * Ej:
 * "Bordado 3D" -> "bordado_3d"
 * "Vinilo Reflectante" -> "vinilo_reflectante"
 */
export function toKey(value) {
  return normalizeText(value)
    .replace(/[()]/g, "")
    .replace(/[+/]/g, " mas ")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");
}

/**
 * Normaliza medidas quitando espacios y pasando coma a punto si aparece.
 * Ej:
 * "10cm x 14cm"
 * "10 x 14"
 * "10x14 cm"
 * -> "10x14"
 */
export function normalizeSize(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/,/g, ".")
    .replace(/cm/g, "")
    .replace(/\s+/g, "")
    .replace(/[×]/g, "x")
    .trim();
}

/**
 * Asegura formato visual consistente de medida para mostrar en UI.
 * Si no quieres usarlo todavía, lo dejamos preparado.
 */
export function toDisplaySize(value) {
  const normalized = normalizeSize(value);
  if (!normalized) return "";

  const [w, h] = normalized.split("x");
  if (!w || !h) return value;

  return `${w} x ${h} cm`;
}

/**
 * Normaliza cantidades de tinta a una clave controlada.
 */
export function normalizeInkCount(value) {
  const text = normalizeText(value);

  if (!text) return "";
  if (text.includes("+4")) return "plus_4";
  if (text.includes("1")) return "1";
  if (text.includes("2")) return "2";
  if (text.includes("3")) return "3";
  if (text.includes("4")) return "4";

  return toKey(text);
}

/**
 * Normaliza opciones de color para pedrería.
 */
export function normalizeColorMode(value) {
  const text = normalizeText(value);

  if (!text) return "";
  if (text.includes("1 color")) return "1_color";
  if (text.includes("2 colores") || text.includes("2 o mas") || text.includes("2 o más")) {
    return "2_plus_colors";
  }

  return toKey(text);
}

/**
 * Normaliza diámetros de rhinestone.
 * Ej: "SS-10 (3mm)" -> "ss_10"
 */
export function normalizeStoneSize(value) {
  const text = normalizeText(value);

  if (text.includes("ss-06") || text.includes("ss06")) return "ss_06";
  if (text.includes("ss-10") || text.includes("ss10")) return "ss_10";
  if (text.includes("ss-16") || text.includes("ss16")) return "ss_16";
  if (text.includes("ss-20") || text.includes("ss20")) return "ss_20";

  return toKey(text);
}

/**
 * Técnica principal.
 * Aquí decidimos la familia grande de personalización.
 */
export function normalizeTechnique(value) {
  const text = normalizeText(value);

  if (text.includes("bordado directo")) return "embroidery";
  if (text.includes("parche bordado")) return "patch";
  if (text.includes("dtf")) return "dtf";
  if (text.includes("dtg")) return "dtg";
  if (text.includes("serigrafia") || text.includes("serigrafía")) return "screenprint";
  if (text.includes("vinilo")) return "vinyl";
  if (text.includes("rhinestone") || text.includes("pedreria") || text.includes("pedrería")) {
    return "rhinestone";
  }
  if (text.includes("etiqueta")) return "label";

  return toKey(text);
}

/**
 * Variante/subtécnica.
 * Ojo: vinilo NO es una técnica distinta por tipo.
 * "Flexy", "Glitter", etc. son variantes dentro de "vinyl".
 */
export function normalizeVariant(value) {
  const text = normalizeText(value);

  if (!text) return "";

  // Bordado
  if (text.includes("matizado")) return "matizado";
  if (text.includes("mixto")) return "mixto";
  if (text.includes("salto de puntada")) return "salto_puntada";
  if (text.includes("3d")) return "3d";

  // Parches decorativos
  if (text.includes("espiga")) return "espiga";
  if (text.includes("cruz")) return "cruz";
  if (text.includes("floral")) return "floral";
  if (text.includes("cadeneta")) return "cadeneta";
  if (text.includes("lentejuelas")) return "lentejuelas";
  if (text.includes("rizo")) return "rizo";

  // Serigrafía
  if (text.includes("plana")) return "plana";
  if (text.includes("puff")) return "puff";
  if (text.includes("otras tintas") || text.includes("acabados")) return "otras_tintas";

  // Vinilos
  if (text.includes("flexy")) return "flexy";
  if (text.includes("glitter")) return "glitter";
  if (text.includes("electrico") || text.includes("eléctrico")) return "electrico";
  if (text.includes("holografico") || text.includes("holográfico")) return "holografico";
  if (text.includes("brick 1000")) return "brick_1000";
  if (text.includes("brick 600")) return "brick_600";
  if (text.includes("flock")) return "flock";
  if (text.includes("reflectante")) return "reflectante";

  // Etiquetas
  if (text.includes("tejida")) return "tejida";
  if (text.includes("estampada")) return "estampada";
  if (text.includes("dtf")) return "dtf";

  return toKey(text);
}

/**
 * Detecta si una opción debería pasar a presupuesto manual.
 * Esto luego nos servirá en pricing.
 */
export function isManualQuoteCase({
  technique,
  variant,
  colorMode,
  inkCount,
}) {
  if (technique === "rhinestone" && colorMode === "2_plus_colors") {
    return true;
  }

  if (technique === "screenprint" && variant === "otras_tintas") {
    return true;
  }

  if (technique === "screenprint" && inkCount === "plus_4") {
    return true;
  }

  return false;
}