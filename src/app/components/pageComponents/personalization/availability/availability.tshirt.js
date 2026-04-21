// src/app/components/pageComponents/personalization/availability/availability.tshirt.js

import {
  PRODUCT_TYPES,
  PRODUCT_VIEWS,
} from "./productViews.js";

import {
  TECHNIQUES,
} from "./techniqueCatalog.js";

import {
  SIZE_GROUPS,
} from "./sizeKeys.js";

/**
 * Disponibilidad para camiseta manga corta y polo manga corta.
 *
 * OJO:
 * - Aquí solo definimos qué técnica/variante/tamaño puede aparecer.
 * - No metemos todavía equivalencias de precio.
 * - No metemos todavía pricing.
 * - Las opciones "manual_quote" se marcan para tratarlas luego.
 */

const FRONT_AND_BACK_TECHNIQUES = {
  [TECHNIQUES.EMBROIDERY]: {
    enabled: true,
    sizeGroup: "EMBROIDERY_BASIC",
    notes: ["3d_max_15x15"],
  },

  [TECHNIQUES.PATCH]: {
    enabled: true,
    sizeGroup: "PATCH_EXTENDED",
  },

  [TECHNIQUES.DTF]: {
    enabled: true,
    sizeGroup: "DTF_STANDARD",
  },

  [TECHNIQUES.DTG]: {
    enabled: true,
    sizeGroup: "DTG_STANDARD",
  },

  [TECHNIQUES.RHINESTONE]: {
    enabled: true,
    sizeGroup: null,
    customSizes: [
      "5x5",
      "5x10",
      "10x10",
      "10x15",
      "15x15",
      "15x20",
      "20x20",
      "20x25",
      "25x25",
      "25x30",
      "30x30",
      "30x35",
      "35x35",
      "35x40",
      "40x40",
    ],
    options: {
      colorModes: ["1_color", "2_plus_colors"],
      stoneSizes: ["ss_06", "ss_10", "ss_16", "ss_20"],
    },
    manualQuoteRules: ["2_plus_colors"],
  },

  [TECHNIQUES.SCREENPRINT]: {
    enabled: true,
    sizeGroup: "SCREENPRINT_STANDARD",
    options: {
      variants: ["plana", "puff", "otras_tintas"],
      inkCounts: ["1", "2", "3", "4", "plus_4"],
    },
    manualQuoteRules: ["otras_tintas", "plus_4"],
  },

  [TECHNIQUES.VINYL]: {
    enabled: true,
    customSizes: [
      "5x5",
      "5x10",
      "10x10",
      "10x15",
      "15x20",
      "20x30",
      "30x40",
    ],
  },
};

const SHORT_SLEEVE_TECHNIQUES = {
  [TECHNIQUES.PATCH]: {
    enabled: true,
    customSizes: ["5x5", "10x5"],
  },

  [TECHNIQUES.DTF]: {
    enabled: true,
    customSizes: ["5x5", "10x5"],
  },

  [TECHNIQUES.RHINESTONE]: {
    enabled: true,
    customSizes: ["5x5", "10x5"],
    options: {
      colorModes: ["1_color", "2_plus_colors"],
      stoneSizes: ["ss_06", "ss_10", "ss_16", "ss_20"],
    },
    manualQuoteRules: ["2_plus_colors"],
  },

  [TECHNIQUES.VINYL]: {
    enabled: true,
    customSizes: ["5x5", "10x5"],
  },
};

const INNER_NECK_TECHNIQUES = {
  [TECHNIQUES.LABEL]: {
    enabled: true,
    variants: ["dtf", "estampada", "tejida"],
    variantSizes: {
      dtf: ["2.5x5", "5x5"],
      estampada: ["3x6", "6x6"],
      tejida: ["3x6", "6x6"],
    },
  },
};

export const TSHIRT_SHORT_SLEEVE_AVAILABILITY = {
  [PRODUCT_TYPES.TSHIRT_SHORT_SLEEVE]: {
    [PRODUCT_VIEWS.FRONT]: FRONT_AND_BACK_TECHNIQUES,
    [PRODUCT_VIEWS.BACK]: FRONT_AND_BACK_TECHNIQUES,
    [PRODUCT_VIEWS.LEFT_SHORT_SLEEVE]: SHORT_SLEEVE_TECHNIQUES,
    [PRODUCT_VIEWS.RIGHT_SHORT_SLEEVE]: SHORT_SLEEVE_TECHNIQUES,
    [PRODUCT_VIEWS.INNER_NECK]: INNER_NECK_TECHNIQUES,
  },

  [PRODUCT_TYPES.POLO_SHORT_SLEEVE]: {
    [PRODUCT_VIEWS.FRONT]: FRONT_AND_BACK_TECHNIQUES,
    [PRODUCT_VIEWS.BACK]: FRONT_AND_BACK_TECHNIQUES,
    [PRODUCT_VIEWS.LEFT_SHORT_SLEEVE]: SHORT_SLEEVE_TECHNIQUES,
    [PRODUCT_VIEWS.RIGHT_SHORT_SLEEVE]: SHORT_SLEEVE_TECHNIQUES,
    [PRODUCT_VIEWS.INNER_NECK]: INNER_NECK_TECHNIQUES,
  },
};

/**
 * Devuelve la disponibilidad de una vista concreta para un tipo de producto.
 */
export function getTshirtViewAvailability(productType, view) {
  return TSHIRT_SHORT_SLEEVE_AVAILABILITY?.[productType]?.[view] || null;
}

/**
 * Devuelve solo las técnicas habilitadas en una vista.
 */
export function getEnabledTechniquesForTshirtView(productType, view) {
  const availability = getTshirtViewAvailability(productType, view);
  if (!availability) return [];

  return Object.entries(availability)
    .filter(([, config]) => config?.enabled)
    .map(([techniqueKey]) => techniqueKey);
}

/**
 * Devuelve tamaños permitidos para una técnica en una vista.
 * Si usa sizeGroup, resuelve desde SIZE_GROUPS.
 * Si usa customSizes, devuelve esas.
 */
export function getSizesForTshirtTechnique(productType, view, techniqueKey) {
  const availability = getTshirtViewAvailability(productType, view);
  const techniqueConfig = availability?.[techniqueKey];

  if (!techniqueConfig) return [];

  if (techniqueConfig.customSizes) {
    return techniqueConfig.customSizes;
  }

  if (techniqueConfig.sizeGroup && SIZE_GROUPS[techniqueConfig.sizeGroup]) {
    return SIZE_GROUPS[techniqueConfig.sizeGroup];
  }

  return [];
}