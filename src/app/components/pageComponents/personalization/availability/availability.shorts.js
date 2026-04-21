// src/app/components/pageComponents/personalization/availability/availability.shorts.js

import {
  PRODUCT_TYPES,
  PRODUCT_VIEWS,
} from "./productViews.js";

import {
  TECHNIQUES,
} from "./techniqueCatalog.js";

/**
 * Shorts
 * Vistas:
 * - shorts_front
 * - shorts_back
 */

const SHORTS_FRONT_TECHNIQUES = {
  [TECHNIQUES.EMBROIDERY]: {
    enabled: true,
    customSizes: ["3x3", "5x5", "7x7", "10x10"],
    notes: [
      "embroidery_only_in_specific_visual_areas",
      "3d_allowed_only_where_embroidery_is_allowed",
    ],
  },

  [TECHNIQUES.PATCH]: {
    enabled: true,
    customSizes: ["5x5", "5x10", "10x10", "10x15", "15x15", "15x20"],
  },

  [TECHNIQUES.DTF]: {
    enabled: true,
    customSizes: ["5x5", "5x10", "10x10", "10x14", "14x20"],
  },

  [TECHNIQUES.RHINESTONE]: {
    enabled: true,
    customSizes: ["5x5", "5x10", "10x10", "10x15", "15x20"],
    options: {
      colorModes: ["1_color", "2_plus_colors"],
      stoneSizes: ["ss_06", "ss_10", "ss_16", "ss_20"],
    },
    manualQuoteRules: ["2_plus_colors"],
  },

  [TECHNIQUES.SCREENPRINT]: {
    enabled: true,
    customSizes: ["10x20"],
    options: {
      variants: ["plana", "puff"],
      inkCounts: ["1"],
    },
    notes: ["10x20_screenprint_price_as_a4"],
  },

  [TECHNIQUES.VINYL]: {
    enabled: true,
    customSizes: ["5x5", "5x10", "10x10", "10x15", "15x20"],
  },
};

const SHORTS_BACK_TECHNIQUES = {
  [TECHNIQUES.EMBROIDERY]: {
    enabled: true,
    customSizes: ["3x3", "5x5", "7x7", "10x10"],
    notes: [
      "embroidery_only_in_specific_visual_areas",
      "3d_allowed_only_where_embroidery_is_allowed",
    ],
  },

  [TECHNIQUES.PATCH]: {
    enabled: true,
    customSizes: ["5x5", "5x10", "10x10", "10x15", "15x20"],
    notes: [
      "10x10_max_for_specific_visual_area",
    ],
  },

  [TECHNIQUES.DTF]: {
    enabled: true,
    customSizes: ["5x5", "5x10", "10x10", "10x14", "14x20"],
    notes: [
      "10x10_max_for_specific_visual_area",
    ],
  },

  [TECHNIQUES.RHINESTONE]: {
    enabled: true,
    customSizes: ["5x5", "5x10", "10x10", "10x15", "15x20"],
    notes: [
      "10x10_max_for_specific_visual_area",
    ],
    options: {
      colorModes: ["1_color", "2_plus_colors"],
      stoneSizes: ["ss_06", "ss_10", "ss_16", "ss_20"],
    },
    manualQuoteRules: ["2_plus_colors"],
  },

  [TECHNIQUES.SCREENPRINT]: {
    enabled: true,
    customSizes: ["10x10", "10x20"],
    options: {
      variants: ["plana", "puff"],
      inkCounts: ["1", "2", "3", "4", "plus_4"],
    },
    manualQuoteRules: ["plus_4"],
    notes: [
      "10x10_screenprint_price_as_a4",
      "10x20_screenprint_price_as_a3",
      "10x10_max_for_specific_visual_area",
    ],
  },

  [TECHNIQUES.VINYL]: {
    enabled: true,
    customSizes: ["5x5", "5x10", "10x10", "10x15", "15x20"],
    notes: [
      "10x10_max_for_specific_visual_area",
    ],
  },
};

export const SHORTS_AVAILABILITY = {
  [PRODUCT_TYPES.SHORTS]: {
    [PRODUCT_VIEWS.SHORTS_FRONT]: SHORTS_FRONT_TECHNIQUES,
    [PRODUCT_VIEWS.SHORTS_BACK]: SHORTS_BACK_TECHNIQUES,
  },
};

export function getShortsViewAvailability(productType, view) {
  return SHORTS_AVAILABILITY?.[productType]?.[view] || null;
}

export function getEnabledTechniquesForShortsView(productType, view) {
  const availability = getShortsViewAvailability(productType, view);
  if (!availability) return [];

  return Object.entries(availability)
    .filter(([, config]) => config?.enabled)
    .map(([techniqueKey]) => techniqueKey);
}

export function getSizesForShortsTechnique(productType, view, techniqueKey) {
  const availability = getShortsViewAvailability(productType, view);
  const techniqueConfig = availability?.[techniqueKey];

  if (!techniqueConfig) return [];

  if (techniqueConfig.customSizes) {
    return techniqueConfig.customSizes;
  }

  return [];
}