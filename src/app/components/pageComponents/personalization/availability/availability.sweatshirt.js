// src/app/components/pageComponents/personalization/availability/availability.sweatshirt.js

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
 * Disponibilidad para:
 * - camiseta manga larga
 * - polo manga larga
 * - sudadera sin capucha
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

const LONG_SLEEVE_TECHNIQUES = {
  [TECHNIQUES.PATCH]: {
    enabled: true,
    customSizes: ["5x5", "5x10", "10x10", "10x15", "10x20", "10x30"],
  },

  [TECHNIQUES.DTF]: {
    enabled: true,
    customSizes: ["5x5", "5x10", "10x10", "10x15", "10x20", "10x30"],
  },

  [TECHNIQUES.RHINESTONE]: {
    enabled: true,
    customSizes: ["5x5", "5x10", "10x10", "10x15", "10x20", "10x30"],
    options: {
      colorModes: ["1_color", "2_plus_colors"],
      stoneSizes: ["ss_06", "ss_10", "ss_16", "ss_20"],
    },
    manualQuoteRules: ["2_plus_colors"],
  },

  [TECHNIQUES.SCREENPRINT]: {
    enabled: true,
    customSizes: ["5x5", "5x10", "10x10", "10x15", "10x20", "10x30"],
    options: {
      variants: ["plana", "puff"],
      inkCounts: ["1", "2", "3", "4", "plus_4"],
    },
    manualQuoteRules: ["plus_4"],
  },

  [TECHNIQUES.VINYL]: {
    enabled: true,
    customSizes: ["5x5", "5x10", "10x10", "10x15", "10x20", "10x30"],
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

export const SWEATSHIRT_AVAILABILITY = {
  [PRODUCT_TYPES.TSHIRT_LONG_SLEEVE]: {
    [PRODUCT_VIEWS.FRONT]: FRONT_AND_BACK_TECHNIQUES,
    [PRODUCT_VIEWS.BACK]: FRONT_AND_BACK_TECHNIQUES,
    [PRODUCT_VIEWS.LEFT_LONG_SLEEVE]: LONG_SLEEVE_TECHNIQUES,
    [PRODUCT_VIEWS.RIGHT_LONG_SLEEVE]: LONG_SLEEVE_TECHNIQUES,
    [PRODUCT_VIEWS.INNER_NECK]: INNER_NECK_TECHNIQUES,
  },

  [PRODUCT_TYPES.POLO_LONG_SLEEVE]: {
    [PRODUCT_VIEWS.FRONT]: FRONT_AND_BACK_TECHNIQUES,
    [PRODUCT_VIEWS.BACK]: FRONT_AND_BACK_TECHNIQUES,
    [PRODUCT_VIEWS.LEFT_LONG_SLEEVE]: LONG_SLEEVE_TECHNIQUES,
    [PRODUCT_VIEWS.RIGHT_LONG_SLEEVE]: LONG_SLEEVE_TECHNIQUES,
    [PRODUCT_VIEWS.INNER_NECK]: INNER_NECK_TECHNIQUES,
  },

  [PRODUCT_TYPES.SWEATSHIRT_NO_HOOD]: {
    [PRODUCT_VIEWS.FRONT]: FRONT_AND_BACK_TECHNIQUES,
    [PRODUCT_VIEWS.BACK]: FRONT_AND_BACK_TECHNIQUES,
    [PRODUCT_VIEWS.LEFT_LONG_SLEEVE]: LONG_SLEEVE_TECHNIQUES,
    [PRODUCT_VIEWS.RIGHT_LONG_SLEEVE]: LONG_SLEEVE_TECHNIQUES,
    [PRODUCT_VIEWS.INNER_NECK]: INNER_NECK_TECHNIQUES,
  },
};

export function getSweatshirtViewAvailability(productType, view) {
  return SWEATSHIRT_AVAILABILITY?.[productType]?.[view] || null;
}

export function getEnabledTechniquesForSweatshirtView(productType, view) {
  const availability = getSweatshirtViewAvailability(productType, view);
  if (!availability) return [];

  return Object.entries(availability)
    .filter(([, config]) => config?.enabled)
    .map(([techniqueKey]) => techniqueKey);
}

export function getSizesForSweatshirtTechnique(productType, view, techniqueKey) {
  const availability = getSweatshirtViewAvailability(productType, view);
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