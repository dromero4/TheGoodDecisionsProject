// src/app/components/pageComponents/personalization/availability/availability.hoodie.js

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
 * Hoodie con bolsillo canguro.
 * Aquí distinguimos:
 * - frontal con limitaciones por bolsillo
 * - trasera amplia
 * - mangas largas
 * - bolsillo canguro
 * - capucha izquierda / derecha
 * - cuello interior
 */

const FRONT_HOODIE_TECHNIQUES = {
  [TECHNIQUES.EMBROIDERY]: {
    enabled: true,
    customSizes: ["3x3", "5x5", "7x7", "10x10", "15x15", "20x27"],
    notes: ["3d_max_15x15", "20x27_price_as_25x25"],
  },

  [TECHNIQUES.PATCH]: {
    enabled: true,
    customSizes: [
      "5x5",
      "5x10",
      "10x10",
      "10x15",
      "15x15",
      "15x20",
      "20x20",
      "20x27",
    ],
    notes: ["20x27_price_as_20x30"],
  },

  [TECHNIQUES.DTF]: {
    enabled: true,
    customSizes: ["5x5", "5x10", "10x10", "10x14", "14x20", "20x27"],
  },

  [TECHNIQUES.DTG]: {
    enabled: true,
    customSizes: ["10x10", "15x20", "20x27"],
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
      "20x27",
    ],
    notes: ["20x27_price_as_25x25"],
    options: {
      colorModes: ["1_color", "2_plus_colors"],
      stoneSizes: ["ss_06", "ss_10", "ss_16", "ss_20"],
    },
    manualQuoteRules: ["2_plus_colors"],
  },

  [TECHNIQUES.SCREENPRINT]: {
    enabled: true,
    customSizes: ["a4"],
    options: {
      variants: ["plana", "puff", "otras_tintas"],
      inkCounts: ["1", "2", "3", "4", "plus_4"],
    },
    manualQuoteRules: ["otras_tintas", "plus_4"],
  },

  [TECHNIQUES.VINYL]: {
    enabled: true,
    customSizes: ["5x5", "5x10", "10x10", "10x15", "15x20", "20x27"],
    notes: ["20x27_price_as_20x30"],
  },
};

const BACK_HOODIE_TECHNIQUES = {
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
    customSizes: ["5x5", "5x10", "10x10", "10x15", "15x20", "20x30", "30x40"],
  },
};

const LONG_SLEEVE_TECHNIQUES = {
  [TECHNIQUES.PATCH]: {
    enabled: true,
    customSizes: ["5x5", "5x10", "10x10", "10x15", "10x20", "10x30"],
    notes: [
      "10x20_patch_price_as_15x20",
      "10x30_patch_price_as_20x30",
    ],
  },

  [TECHNIQUES.DTF]: {
    enabled: true,
    customSizes: ["5x5", "5x10", "10x10", "10x15", "10x20", "10x30"],
    notes: [
      "10x20_dtf_price_as_14x20",
      "10x30_dtf_price_as_20x27",
    ],
  },

  [TECHNIQUES.RHINESTONE]: {
    enabled: true,
    customSizes: ["5x5", "5x10", "10x10", "10x15", "10x20", "10x30"],
    notes: [
      "10x20_rhinestone_price_as_15x20",
      "10x30_rhinestone_price_as_20x30",
    ],
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
    notes: [
      "5x5_screenprint_price_as_a4",
      "5x10_screenprint_price_as_a4",
      "10x10_screenprint_price_as_a4",
      "10x15_screenprint_price_as_a3",
      "10x20_screenprint_price_as_a3",
      "10x30_screenprint_price_as_a3",
    ],
  },

  [TECHNIQUES.VINYL]: {
    enabled: true,
    customSizes: ["5x5", "5x10", "10x10", "10x15", "10x20", "10x30"],
    notes: [
      "10x20_vinyl_price_as_10x30",
      "10x30_vinyl_price_as_20x30",
    ],
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

const KANGAROO_POCKET_TECHNIQUES = {
  [TECHNIQUES.PATCH]: {
    enabled: true,
    customSizes: ["5x5", "5x10", "10x10", "10x15", "15x15", "20x15"],
  },

  [TECHNIQUES.DTF]: {
    enabled: true,
    customSizes: ["5x5", "10x5", "10x10", "14x10", "20x14"],
  },

  [TECHNIQUES.RHINESTONE]: {
    enabled: true,
    customSizes: ["5x5", "5x10", "10x10", "10x15", "15x15", "15x20"],
    options: {
      colorModes: ["1_color", "2_plus_colors"],
      stoneSizes: ["ss_06", "ss_10", "ss_16", "ss_20"],
    },
    manualQuoteRules: ["2_plus_colors"],
  },

  [TECHNIQUES.VINYL]: {
    enabled: true,
    customSizes: ["5x5", "5x10", "10x10", "10x15", "15x20"],
  },
};

const HOOD_SIDE_TECHNIQUES = {
  [TECHNIQUES.PATCH]: {
    enabled: true,
    customSizes: ["5x5", "5x10", "10x10", "10x15", "15x15", "20x15"],
  },

  [TECHNIQUES.DTF]: {
    enabled: true,
    customSizes: ["5x5", "10x5", "10x10", "14x10", "20x14"],
  },

  [TECHNIQUES.RHINESTONE]: {
    enabled: true,
    customSizes: ["5x5", "5x10", "10x10", "10x15", "15x15", "15x20"],
    options: {
      colorModes: ["1_color", "2_plus_colors"],
      stoneSizes: ["ss_06", "ss_10", "ss_16", "ss_20"],
    },
    manualQuoteRules: ["2_plus_colors"],
  },

  [TECHNIQUES.VINYL]: {
    enabled: true,
    customSizes: ["5x5", "5x10", "10x10", "10x15", "15x20"],
  },
};

export const HOODIE_AVAILABILITY = {
  [PRODUCT_TYPES.HOODIE_KANGAROO]: {
    [PRODUCT_VIEWS.FRONT]: FRONT_HOODIE_TECHNIQUES,
    [PRODUCT_VIEWS.BACK]: BACK_HOODIE_TECHNIQUES,
    [PRODUCT_VIEWS.LEFT_LONG_SLEEVE]: LONG_SLEEVE_TECHNIQUES,
    [PRODUCT_VIEWS.RIGHT_LONG_SLEEVE]: LONG_SLEEVE_TECHNIQUES,
    [PRODUCT_VIEWS.INNER_NECK]: INNER_NECK_TECHNIQUES,
    [PRODUCT_VIEWS.KANGAROO_POCKET]: KANGAROO_POCKET_TECHNIQUES,
    [PRODUCT_VIEWS.HOOD_LEFT]: HOOD_SIDE_TECHNIQUES,
    [PRODUCT_VIEWS.HOOD_RIGHT]: HOOD_SIDE_TECHNIQUES,
  },
};

export function getHoodieViewAvailability(productType, view) {
  return HOODIE_AVAILABILITY?.[productType]?.[view] || null;
}

export function getEnabledTechniquesForHoodieView(productType, view) {
  const availability = getHoodieViewAvailability(productType, view);
  if (!availability) return [];

  return Object.entries(availability)
    .filter(([, config]) => config?.enabled)
    .map(([techniqueKey]) => techniqueKey);
}

export function getSizesForHoodieTechnique(productType, view, techniqueKey) {
  const availability = getHoodieViewAvailability(productType, view);
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