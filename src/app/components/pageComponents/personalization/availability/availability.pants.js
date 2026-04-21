// src/app/components/pageComponents/personalization/availability/availability.pants.js

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
 * Pantalones largos
 * Vistas:
 * - pants_front
 * - pants_back
 *
 * Nota:
 * En el documento original el bordado directo está limitado a ciertas secciones.
 * Como aquí no usamos secciones en UI, dejamos el bordado disponible con tamaños
 * muy concretos y ya decidiremos después si lo restringimos por zona visual exacta.
 */

const PANTS_FRONT_TECHNIQUES = {
  [TECHNIQUES.EMBROIDERY]: {
    enabled: true,
    customSizes: ["3x3", "5x5", "7x7"],
    notes: [
      "embroidery_only_in_specific_visual_areas",
      "3d_allowed_only_where_embroidery_is_allowed",
    ],
  },

  [TECHNIQUES.PATCH]: {
    enabled: true,
    customSizes: [
      "5x5",
      "5x10",
      "10x10",
      "10x15",
      "10x20",
      "10x30",
      "10x40",
    ],
    notes: [
      "10x20_patch_price_as_15x20",
      "10x30_patch_price_as_20x30",
      "10x40_patch_price_as_27x40",
    ],
  },

  [TECHNIQUES.DTF]: {
    enabled: true,
    customSizes: [
      "5x5",
      "5x10",
      "10x10",
      "10x14",
      "10x20",
      "10x30",
      "10x40",
    ],
    notes: [
      "10x20_dtf_price_as_14x20",
      "10x30_dtf_price_as_20x27",
      "10x40_dtf_price_as_27x40",
    ],
  },

  [TECHNIQUES.RHINESTONE]: {
    enabled: true,
    customSizes: [
      "5x5",
      "5x10",
      "10x10",
      "10x15",
      "10x20",
      "10x30",
      "10x40",
    ],
    notes: [
      "10x30_rhinestone_price_as_20x30",
      "10x40_rhinestone_price_as_30x40",
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
    customSizes: [
      "5x5",
      "5x10",
      "10x10",
      "10x15",
      "10x20",
      "10x30",
      "10x40",
    ],
    notes: [
      "10x20_vinyl_price_as_15x20",
      "10x30_vinyl_price_as_20x30",
      "10x40_vinyl_price_as_30x40",
    ],
  },
};

const PANTS_BACK_TECHNIQUES = {
  [TECHNIQUES.EMBROIDERY]: {
    enabled: true,
    customSizes: ["3x3", "5x5", "7x7"],
    notes: [
      "embroidery_only_in_specific_visual_areas",
      "3d_allowed_only_where_embroidery_is_allowed",
    ],
  },

  [TECHNIQUES.PATCH]: {
    enabled: true,
    customSizes: [
      "5x5",
      "5x10",
      "10x10",
      "10x15",
      "10x20",
      "10x30",
      "10x40",
    ],
    notes: [
      "10x20_patch_price_as_15x20",
      "10x30_patch_price_as_20x30",
      "10x40_patch_price_as_27x40",
    ],
  },

  [TECHNIQUES.DTF]: {
    enabled: true,
    customSizes: [
      "5x5",
      "5x10",
      "10x10",
      "10x14",
      "10x20",
      "10x30",
      "10x40",
    ],
    notes: [
      "10x20_dtf_price_as_14x20",
      "10x30_dtf_price_as_20x27",
      "10x40_dtf_price_as_27x40",
    ],
  },

  [TECHNIQUES.RHINESTONE]: {
    enabled: true,
    customSizes: [
      "5x5",
      "5x10",
      "10x10",
      "10x15",
      "10x20",
      "10x30",
      "10x40",
    ],
    notes: [
      "10x30_rhinestone_price_as_20x30",
      "10x40_rhinestone_price_as_30x40",
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
    customSizes: [
      "5x5",
      "5x10",
      "10x10",
      "10x15",
      "10x20",
      "10x30",
      "10x40",
    ],
    notes: [
      "10x20_vinyl_price_as_15x20",
      "10x30_vinyl_price_as_20x30",
      "10x40_vinyl_price_as_30x40",
    ],
  },
};

export const PANTS_AVAILABILITY = {
  [PRODUCT_TYPES.PANTS]: {
    [PRODUCT_VIEWS.PANTS_FRONT]: PANTS_FRONT_TECHNIQUES,
    [PRODUCT_VIEWS.PANTS_BACK]: PANTS_BACK_TECHNIQUES,
  },
};

export function getPantsViewAvailability(productType, view) {
  return PANTS_AVAILABILITY?.[productType]?.[view] || null;
}

export function getEnabledTechniquesForPantsView(productType, view) {
  const availability = getPantsViewAvailability(productType, view);
  if (!availability) return [];

  return Object.entries(availability)
    .filter(([, config]) => config?.enabled)
    .map(([techniqueKey]) => techniqueKey);
}

export function getSizesForPantsTechnique(productType, view, techniqueKey) {
  const availability = getPantsViewAvailability(productType, view);
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