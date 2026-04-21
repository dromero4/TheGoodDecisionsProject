// src/app/components/pageComponents/personalization/availability/index.js

import { TSHIRT_SHORT_SLEEVE_AVAILABILITY } from "./availability.tshirt.js";
import { SWEATSHIRT_AVAILABILITY } from "./availability.sweatshirt.js";
import { HOODIE_AVAILABILITY } from "./availability.hoodie.js";
import { JACKET_AVAILABILITY } from "./availability.jacket.js";
import { PANTS_AVAILABILITY } from "./availability.pants.js";
import { SHORTS_AVAILABILITY } from "./availability.shorts.js";

import { SIZE_GROUPS } from "./sizeKeys.js";

/**
 * Mapa central de disponibilidad.
 * Reúne todos los tipos de producto en un único objeto.
 */
export const PRODUCT_AVAILABILITY = {
  ...TSHIRT_SHORT_SLEEVE_AVAILABILITY,
  ...SWEATSHIRT_AVAILABILITY,
  ...HOODIE_AVAILABILITY,
  ...JACKET_AVAILABILITY,
  ...PANTS_AVAILABILITY,
  ...SHORTS_AVAILABILITY,
};

/**
 * Devuelve toda la disponibilidad de un tipo de producto.
 */
export function getAvailabilityForProductType(productType) {
  return PRODUCT_AVAILABILITY[productType] || null;
}

/**
 * Devuelve la disponibilidad de una vista concreta.
 */
export function getAvailabilityForView(productType, view) {
  return PRODUCT_AVAILABILITY?.[productType]?.[view] || null;
}

/**
 * Devuelve las técnicas habilitadas en una vista.
 */
export function getEnabledTechniquesForView(productType, view) {
  const availability = getAvailabilityForView(productType, view);
  if (!availability) return [];

  return Object.entries(availability)
    .filter(([, config]) => config?.enabled)
    .map(([techniqueKey]) => techniqueKey);
}

/**
 * Devuelve la configuración completa de una técnica concreta en una vista.
 * Muy útil para UI y pricing.
 */
export function getTechniqueConfig(productType, view, techniqueKey) {
  const availability = getAvailabilityForView(productType, view);
  return availability?.[techniqueKey] || null;
}

/**
 * Devuelve tamaños disponibles para una técnica concreta.
 * Si hay customSizes, usa esos.
 * Si hay sizeGroup, resuelve desde SIZE_GROUPS.
 */
export function getSizesForTechnique(productType, view, techniqueKey) {
  const techniqueConfig = getTechniqueConfig(productType, view, techniqueKey);

  if (!techniqueConfig) return [];

  if (techniqueConfig.customSizes) {
    return techniqueConfig.customSizes;
  }

  if (techniqueConfig.sizeGroup && SIZE_GROUPS[techniqueConfig.sizeGroup]) {
    return SIZE_GROUPS[techniqueConfig.sizeGroup];
  }

  return [];
}

/**
 * Devuelve variantes explícitas de una técnica en una vista,
 * si esa vista las limita de forma específica.
 */
export function getVariantsForTechnique(productType, view, techniqueKey) {
  const techniqueConfig = getTechniqueConfig(productType, view, techniqueKey);
  return techniqueConfig?.variants || techniqueConfig?.options?.variants || [];
}

/**
 * Devuelve opciones adicionales de una técnica:
 * - inkCounts
 * - colorModes
 * - stoneSizes
 * etc.
 */
export function getTechniqueOptions(productType, view, techniqueKey) {
  const techniqueConfig = getTechniqueConfig(productType, view, techniqueKey);
  return techniqueConfig?.options || {};
}

/**
 * Devuelve reglas marcadas como manual_quote
 * o pistas para decidir más adelante.
 */
export function getManualQuoteRules(productType, view, techniqueKey) {
  const techniqueConfig = getTechniqueConfig(productType, view, techniqueKey);
  return techniqueConfig?.manualQuoteRules || [];
}

/**
 * Devuelve notas internas de esa técnica en esa vista.
 * Estas notas nos servirán luego para equivalencias de precio o validaciones.
 */
export function getTechniqueNotes(productType, view, techniqueKey) {
  const techniqueConfig = getTechniqueConfig(productType, view, techniqueKey);
  return techniqueConfig?.notes || [];
}