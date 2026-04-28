// src/app/components/pageComponents/personalization/availability/sizeNormalization.config.js

/**
 * Este archivo no decide si una técnica/tamaño está disponible.
 * Solo decide qué tamaño/precio interno se debe usar para cobrar.
 *
 * Ejemplo:
 * - usuario elige "10x20"
 * - pero el sistema cobra "15x20"
 *
 * Esto se aplicará luego dentro del motor de precios.
 */

/**
 * Reglas generales por técnica.
 * Se usan cuando no haya una regla más específica por vista o producto.
 */
export const GLOBAL_SIZE_PRICE_EQUIVALENCES = {
  embroidery: {
    "20x27": "25x25",
    "14x15": "15x15",
    "14x20": "25x25",
  },

  patch: {
    "10x20": "15x20",
    "10x30": "20x30",
    "10x40": "27x40",
    "14x15": "15x15",
    "14x20": "15x20",
    "20x27": "20x30",
    "5x7.5": "5x10",
  },

  dtf: {
    "10x20": "14x20",
    "10x30": "20x27",
    "10x40": "27x40",
  },

  dtg: {
    "14x20": "15x20",
    "34,5x49": "34_5x49",
    "34.5x49": "34_5x49",
  },

  rhinestones: {
    "10x20": "15x20",
    "10x30": "20x30",
    "10x40": "30x40",
    "14x15": "15x15",
    "14x20": "15x20",
    "20x27": "25x25",

    "15x10": "10x15",
    "20x15": "15x20",
    "20x20": "20x20",
    "25x17": "17x25",
    "25x17.5": "17x25",
    "30x20": "20x30",
    "35x25": "25x35",
    "40x30": "30x40",
  },

  vinyl: {
    "40x30": "30x40",
    "30x20": "20x30",
    "20x15": "15x20",
    "15x10": "10x15",

    "10x20": "15x20",
    "10x30": "20x30",
    "10x40": "30x40",
    "20x27": "20x30",

    "5x7.5": "5x10",
  },
  screenprint: {
    a5: "a4",

    "5x5": "a4",
    "5x10": "a4",
    "10x10": "a4",

    "10x15": "a3",
    "10x20": "a3",
    "10x30": "a3",
  },
};

/**
 * Reglas específicas por producto y vista.
 * Estas tienen prioridad sobre las globales cuando haga falta afinar.
 *
 * Estructura:
 * productType -> view -> technique -> { requestedSize: chargedSize }
 */
export const PRODUCT_VIEW_SIZE_PRICE_EQUIVALENCES = {
  hoodie_kangaroo: {
    front: {
      embroidery: {
        "20x27": "25x25",
      },
      patch: {
        "20x27": "20x30",
      },
      rhinestones: {
        "20x27": "25x25",
      },
      vinyl: {
        "20x27": "20x30",
      },
      screenprint: {
        a4: "a4",
      },
    },

    left_long_sleeve: {
      patch: {
        "10x20": "15x20",
        "10x30": "20x30",
      },
      dtf: {
        "10x20": "14x20",
        "10x30": "20x27",
      },
      rhinestones: {
        "10x20": "15x20",
        "10x30": "20x30",
      },
      vinyl: {
        "10x20": "15x20",
        "10x30": "20x30",
      },
      screenprint: {
        "5x5": "a4",
        "5x10": "a4",
        "10x10": "a4",
        "10x15": "a3",
        "10x20": "a3",
        "10x30": "a3",
      },
    },

    right_long_sleeve: {
      patch: {
        "10x20": "15x20",
        "10x30": "20x30",
      },
      dtf: {
        "10x20": "14x20",
        "10x30": "20x27",
      },
      rhinestones: {
        "10x20": "15x20",
        "10x30": "20x30",
      },
      vinyl: {
        "10x20": "15x20",
        "10x30": "20x30",
      },
      screenprint: {
        "5x5": "a4",
        "5x10": "a4",
        "10x10": "a4",
        "10x15": "a3",
        "10x20": "a3",
        "10x30": "a3",
      },
    },
  },

  zip_hoodie_visible_pockets: {
    front: {
      embroidery: {
        "14x15": "15x15",
        "14x20": "25x25",
      },
      patch: {
        "14x15": "15x15",
        "14x20": "15x20",
      },
      dtg: {
        "14x20": "15x20",
        "34,5x49": "34_5x49",
        "34.5x49": "34_5x49",
      },
      rhinestones: {
        "14x15": "15x15",
        "14x20": "15x20",
      },
      screenprint: {
        a5: "a4",
      },
      vinyl: {
        "14x20": "15x20",
      },
    },
  },

  jacket_no_visible_pockets: {
    front: {
      patch: {
        "10x20": "15x20",
        "10x30": "20x30",
        "10x40": "27x40",
      },
      dtf: {
        "10x20": "14x20",
        "10x30": "20x27",
        "10x40": "27x40",
      },
      rhinestones: {
        "10x30": "20x30",
        "10x40": "30x40",
      },
      vinyl: {
        "10x20": "15x20",
        "10x30": "20x30",
        "10x40": "30x40",
      },
    },
  },

  pants: {
    pants_front: {
      patch: {
        "10x20": "15x20",
        "10x30": "20x30",
        "10x40": "27x40",
      },
      dtf: {
        "10x20": "14x20",
        "10x30": "20x27",
        "10x40": "27x40",
      },
      rhinestones: {
        "10x30": "20x30",
        "10x40": "30x40",
      },
      vinyl: {
        "10x20": "15x20",
        "10x30": "20x30",
        "10x40": "30x40",
      },
      screenprint: {
        "5x5": "a4",
        "5x10": "a4",
        "10x10": "a4",
        "10x15": "a3",
        "10x20": "a3",
        "10x30": "a3",
      },
    },

    pants_back: {
      patch: {
        "10x20": "15x20",
        "10x30": "20x30",
        "10x40": "27x40",
      },
      dtf: {
        "10x20": "14x20",
        "10x30": "20x27",
        "10x40": "27x40",
      },
      rhinestones: {
        "10x30": "20x30",
        "10x40": "30x40",
      },
      vinyl: {
        "10x20": "15x20",
        "10x30": "20x30",
        "10x40": "30x40",
      },
      screenprint: {
        "5x5": "a4",
        "5x10": "a4",
        "10x10": "a4",
        "10x15": "a3",
        "10x20": "a3",
        "10x30": "a3",
      },
    },
  },

  shorts: {
    shorts_front: {
      screenprint: {
        "10x20": "a4",
      },
    },

    shorts_back: {
      screenprint: {
        "10x10": "a4",
        "10x20": "a3",
      },
    },
  },
};

/**
 * Regla especial para topes.
 * Aquí no mapeamos precio; aquí validamos límites.
 */
export const SIZE_LIMIT_RULES = {
  embroidery: {
    "3d": {
      maxAllowedSize: "15x15",
    },
  },
};

/**
 * Devuelve el tamaño que se usará para precio.
 * Prioridad:
 * 1. regla específica por producto/vista
 * 2. regla global por técnica
 * 3. si no existe regla, se usa el tamaño original
 */
export function resolveChargedSize({
  productType,
  view,
  technique,
  requestedSize,
}) {
  const productRule =
    PRODUCT_VIEW_SIZE_PRICE_EQUIVALENCES?.[productType]?.[view]?.[technique]?.[
    requestedSize
    ];

  if (productRule) return productRule;

  const globalRule =
    GLOBAL_SIZE_PRICE_EQUIVALENCES?.[technique]?.[requestedSize];

  if (globalRule) return globalRule;

  return requestedSize;
}

/**
 * Devuelve si una combinación de técnica/variante/tamaño supera un límite.
 * De momento lo usamos sobre todo para bordado 3D.
 */
export function isSizeBlockedByRules({
  technique,
  variant,
  requestedSize,
}) {
  const techniqueRules = SIZE_LIMIT_RULES?.[technique];
  const variantRules = techniqueRules?.[variant];

  if (!variantRules?.maxAllowedSize) return false;

  const maxAllowedSize = variantRules.maxAllowedSize;

  return requestedSize !== maxAllowedSize && isSizeBiggerThan(requestedSize, maxAllowedSize);
}

/**
 * Comparador simple para tamaños rectangulares.
 * Compara por área.
 * No sirve para comparar A4/A3 con cm, pero para 3D nos basta.
 */
export function isSizeBiggerThan(sizeA, sizeB) {
  const areaA = getSizeArea(sizeA);
  const areaB = getSizeArea(sizeB);

  if (!areaA || !areaB) return false;

  return areaA > areaB;
}

export function getSizeArea(sizeKey) {
  if (!sizeKey || sizeKey === "a4" || sizeKey === "a3" || sizeKey === "a5") {
    return null;
  }

  const [w, h] = String(sizeKey).split("x").map(Number);

  if (!w || !h) return null;

  return w * h;
}