// src/lib/personalization/availability/productViews.js

/**
 * Vistas internas del personalizador.
 * Estas claves no tienen por qué coincidir con nombres visuales de la web.
 * Sirven para unificar disponibilidad, pricing y resumen del pedido.
 */

export const PRODUCT_VIEWS = {
  // Partes comunes
  FRONT: "front",
  BACK: "back",
  INNER_NECK: "inner_neck",

  // Mangas
  LEFT_SHORT_SLEEVE: "left_short_sleeve",
  RIGHT_SHORT_SLEEVE: "right_short_sleeve",
  LEFT_LONG_SLEEVE: "left_long_sleeve",
  RIGHT_LONG_SLEEVE: "right_long_sleeve",

  // Sudaderas / chaquetas
  KANGAROO_POCKET: "kangaroo_pocket",
  RIGHT_POCKET: "right_pocket",
  LEFT_POCKET: "left_pocket",
  HOOD_LEFT: "hood_left",
  HOOD_RIGHT: "hood_right",

  // Pantalones largos
  PANTS_FRONT: "pants_front",
  PANTS_BACK: "pants_back",

  // Shorts
  SHORTS_FRONT: "shorts_front",
  SHORTS_BACK: "shorts_back",
};

/**
 * Etiquetas legibles para UI o resumen.
 */
export const PRODUCT_VIEW_LABELS = {
  [PRODUCT_VIEWS.FRONT]: "Frontal",
  [PRODUCT_VIEWS.BACK]: "Trasera",
  [PRODUCT_VIEWS.INNER_NECK]: "Cuello interior",

  [PRODUCT_VIEWS.LEFT_SHORT_SLEEVE]: "Manga corta izquierda",
  [PRODUCT_VIEWS.RIGHT_SHORT_SLEEVE]: "Manga corta derecha",
  [PRODUCT_VIEWS.LEFT_LONG_SLEEVE]: "Manga larga izquierda",
  [PRODUCT_VIEWS.RIGHT_LONG_SLEEVE]: "Manga larga derecha",

  [PRODUCT_VIEWS.KANGAROO_POCKET]: "Bolsillo canguro",
  [PRODUCT_VIEWS.RIGHT_POCKET]: "Bolsillo derecho",
  [PRODUCT_VIEWS.LEFT_POCKET]: "Bolsillo izquierdo",
  [PRODUCT_VIEWS.HOOD_LEFT]: "Capucha izquierda",
  [PRODUCT_VIEWS.HOOD_RIGHT]: "Capucha derecha",

  [PRODUCT_VIEWS.PANTS_FRONT]: "Pantalón frontal",
  [PRODUCT_VIEWS.PANTS_BACK]: "Pantalón trasero",

  [PRODUCT_VIEWS.SHORTS_FRONT]: "Short frontal",
  [PRODUCT_VIEWS.SHORTS_BACK]: "Short trasero",
};

/**
 * Tipos de producto internos.
 * Nos interesa separarlos por estructura real de personalización,
 * no solo por nombre comercial.
 */
export const PRODUCT_TYPES = {
  TSHIRT_SHORT_SLEEVE: "tshirt_short_sleeve",
  TSHIRT_LONG_SLEEVE: "tshirt_long_sleeve",
  POLO_SHORT_SLEEVE: "polo_short_sleeve",
  POLO_LONG_SLEEVE: "polo_long_sleeve",

  SWEATSHIRT_NO_HOOD: "sweatshirt_no_hood",
  HOODIE_KANGAROO: "hoodie_kangaroo",
  ZIP_HOODIE_VISIBLE_POCKETS: "zip_hoodie_visible_pockets",
  JACKET_NO_VISIBLE_POCKETS: "jacket_no_visible_pockets",

  PANTS: "pants",
  SHORTS: "shorts",
};

/**
 * Qué vistas existen por cada tipo de producto.
 * Luego disponibilidad limitará técnicas y medidas dentro de cada vista.
 */
export const PRODUCT_TYPE_VIEWS = {
  [PRODUCT_TYPES.TSHIRT_SHORT_SLEEVE]: [
    PRODUCT_VIEWS.FRONT,
    PRODUCT_VIEWS.BACK,
    PRODUCT_VIEWS.LEFT_SHORT_SLEEVE,
    PRODUCT_VIEWS.RIGHT_SHORT_SLEEVE,
    PRODUCT_VIEWS.INNER_NECK,
  ],

  [PRODUCT_TYPES.POLO_SHORT_SLEEVE]: [
    PRODUCT_VIEWS.FRONT,
    PRODUCT_VIEWS.BACK,
    PRODUCT_VIEWS.LEFT_SHORT_SLEEVE,
    PRODUCT_VIEWS.RIGHT_SHORT_SLEEVE,
    PRODUCT_VIEWS.INNER_NECK,
  ],

  [PRODUCT_TYPES.TSHIRT_LONG_SLEEVE]: [
    PRODUCT_VIEWS.FRONT,
    PRODUCT_VIEWS.BACK,
    PRODUCT_VIEWS.LEFT_LONG_SLEEVE,
    PRODUCT_VIEWS.RIGHT_LONG_SLEEVE,
    PRODUCT_VIEWS.INNER_NECK,
  ],

  [PRODUCT_TYPES.POLO_LONG_SLEEVE]: [
    PRODUCT_VIEWS.FRONT,
    PRODUCT_VIEWS.BACK,
    PRODUCT_VIEWS.LEFT_LONG_SLEEVE,
    PRODUCT_VIEWS.RIGHT_LONG_SLEEVE,
    PRODUCT_VIEWS.INNER_NECK,
  ],

  [PRODUCT_TYPES.SWEATSHIRT_NO_HOOD]: [
    PRODUCT_VIEWS.FRONT,
    PRODUCT_VIEWS.BACK,
    PRODUCT_VIEWS.LEFT_LONG_SLEEVE,
    PRODUCT_VIEWS.RIGHT_LONG_SLEEVE,
    PRODUCT_VIEWS.INNER_NECK,
  ],

  [PRODUCT_TYPES.HOODIE_KANGAROO]: [
    PRODUCT_VIEWS.FRONT,
    PRODUCT_VIEWS.BACK,
    PRODUCT_VIEWS.LEFT_LONG_SLEEVE,
    PRODUCT_VIEWS.RIGHT_LONG_SLEEVE,
    PRODUCT_VIEWS.INNER_NECK,
    PRODUCT_VIEWS.KANGAROO_POCKET,
    PRODUCT_VIEWS.HOOD_LEFT,
    PRODUCT_VIEWS.HOOD_RIGHT,
  ],

  [PRODUCT_TYPES.ZIP_HOODIE_VISIBLE_POCKETS]: [
    PRODUCT_VIEWS.FRONT,
    PRODUCT_VIEWS.BACK,
    PRODUCT_VIEWS.LEFT_LONG_SLEEVE,
    PRODUCT_VIEWS.RIGHT_LONG_SLEEVE,
    PRODUCT_VIEWS.INNER_NECK,
    PRODUCT_VIEWS.RIGHT_POCKET,
    PRODUCT_VIEWS.LEFT_POCKET,
    PRODUCT_VIEWS.HOOD_LEFT,
    PRODUCT_VIEWS.HOOD_RIGHT,
  ],

  [PRODUCT_TYPES.JACKET_NO_VISIBLE_POCKETS]: [
    PRODUCT_VIEWS.FRONT,
    PRODUCT_VIEWS.BACK,
    PRODUCT_VIEWS.LEFT_LONG_SLEEVE,
    PRODUCT_VIEWS.RIGHT_LONG_SLEEVE,
    PRODUCT_VIEWS.INNER_NECK,
  ],

  [PRODUCT_TYPES.PANTS]: [
    PRODUCT_VIEWS.PANTS_FRONT,
    PRODUCT_VIEWS.PANTS_BACK,
  ],

  [PRODUCT_TYPES.SHORTS]: [
    PRODUCT_VIEWS.SHORTS_FRONT,
    PRODUCT_VIEWS.SHORTS_BACK,
  ],
};

/**
 * Helper simple para saber si un producto tiene una vista concreta.
 */
export function productHasView(productType, view) {
  const views = PRODUCT_TYPE_VIEWS[productType] || [];
  return views.includes(view);
}

/**
 * Devuelve las vistas disponibles para un tipo de producto.
 */
export function getViewsForProductType(productType) {
  return PRODUCT_TYPE_VIEWS[productType] || [];
}