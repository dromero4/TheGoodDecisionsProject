// src/app/components/pageComponents/personalization/pricing/calculatePlacementPrice.js

import { getQuantityBracket } from "./quantityBrackets.js";
import { resolveChargedSize, isSizeBlockedByRules } from "../availability/sizeNormalization.config.js";

import { getDtfUnitPrice } from "./pricing.tables.dtf.js";
import { getEmbroideryUnitPrice } from "./pricing.tables.embroidery.js";
import { getEmbroidery3dUnitPrice } from "./pricing.tables.embroidery3d.js";
import { getPatchUnitPrice } from "./pricing.tables.patch.js";
import { getScreenprintUnitPrice } from "./pricing.tables.screenprint.js";

/**
 * Calcula el precio de una personalización individual.
 *
 * De momento:
 * - soporta DTF
 * - deja preparada la estructura para añadir más técnicas
 */
export function calculatePlacementPrice({
  productType,
  view,
  technique,
  variant = "",
  requestedSize,
  quantity,
  inkCount = "",
}) {
  if (!technique || !requestedSize || !quantity) {
    return {
      pricingMode: "invalid",
      reason: "missing_required_fields",
      unitPrice: null,
      totalPrice: null,
      requestedSize: requestedSize || null,
      chargedSize: null,
      quantityBracket: null,
    };
  }

  const sizeBlocked = isSizeBlockedByRules({
    technique,
    variant,
    requestedSize,
  });

  if (sizeBlocked) {
    return {
      pricingMode: "blocked",
      reason: "size_blocked_by_rules",
      unitPrice: null,
      totalPrice: null,
      requestedSize,
      chargedSize: null,
      quantityBracket: null,
    };
  }

  const chargedSize = resolveChargedSize({
    productType,
    view,
    technique,
    requestedSize,
  });

  const quantityBracket = getQuantityBracket(quantity);

  if (!quantityBracket) {
    return {
      pricingMode: "invalid",
      reason: "invalid_quantity",
      unitPrice: null,
      totalPrice: null,
      requestedSize,
      chargedSize,
      quantityBracket: null,
    };
  }

  //DTF
  if (technique === "dtf") {
    const unitPrice = getDtfUnitPrice(chargedSize, quantityBracket);

    if (unitPrice == null) {
      return {
        pricingMode: "manual_quote",
        reason: "dtf_price_not_found",
        unitPrice: null,
        totalPrice: null,
        requestedSize,
        chargedSize,
        quantityBracket,
      };
    }

    return {
      pricingMode: "automatic",
      technique,
      variant,
      requestedSize,
      chargedSize,
      quantity,
      quantityBracket,
      unitPrice,
      totalPrice: roundPrice(unitPrice * quantity),
    };
  }

  //BORDADO
  if (
    technique === "embroidery" &&
    ["matizado", "mixto", "salto_puntada"].includes(variant)
  ) {
    const unitPrice = getEmbroideryUnitPrice(chargedSize, quantityBracket);

    if (unitPrice == null) {
      return {
        pricingMode: "manual_quote",
        reason: "embroidery_price_not_found",
        unitPrice: null,
        totalPrice: null,
        requestedSize,
        chargedSize,
        quantityBracket,
      };
    }

    return {
      pricingMode: "automatic",
      technique,
      variant,
      requestedSize,
      chargedSize,
      quantity,
      quantityBracket,
      unitPrice,
      totalPrice: roundPrice(unitPrice * quantity),
    };
  }

  //BORDADO 3D
    if (technique === "embroidery" && variant === "3d") {
    const unitPrice = getEmbroidery3dUnitPrice(chargedSize, quantityBracket);

    if (unitPrice == null) {
      return {
        pricingMode: "manual_quote",
        reason: "embroidery_3d_price_not_found",
        unitPrice: null,
        totalPrice: null,
        requestedSize,
        chargedSize,
        quantityBracket,
      };
    }

    return {
      pricingMode: "automatic",
      technique,
      variant,
      requestedSize,
      chargedSize,
      quantity,
      quantityBracket,
      unitPrice,
      totalPrice: roundPrice(unitPrice * quantity),
    };
  }

  //PARCHE BORDADO
    if (technique === "patch") {
    const unitPrice = getPatchUnitPrice(chargedSize, quantityBracket);

    if (unitPrice == null) {
      return {
        pricingMode: "manual_quote",
        reason: "patch_price_not_found",
        unitPrice: null,
        totalPrice: null,
        requestedSize,
        chargedSize,
        quantityBracket,
      };
    }

    return {
      pricingMode: "automatic",
      technique,
      variant,
      requestedSize,
      chargedSize,
      quantity,
      quantityBracket,
      unitPrice,
      totalPrice: roundPrice(unitPrice * quantity),
    };
  }

  //SERIGRAFIA PLANA / PUFF
    if (technique === "screenprint") {
    if (variant !== "plana") {
      return {
        pricingMode: "manual_quote",
        reason: "screenprint_variant_not_implemented_yet",
        unitPrice: null,
        totalPrice: null,
        requestedSize,
        chargedSize,
        quantityBracket,
      };
    }

    if (!["1", "2", "3", "4"].includes(String(inkCount))) {
      return {
        pricingMode: "manual_quote",
        reason: "screenprint_invalid_or_manual_ink_count",
        unitPrice: null,
        totalPrice: null,
        requestedSize,
        chargedSize,
        quantityBracket,
      };
    }

    const unitPrice = getScreenprintUnitPrice(
      chargedSize,
      String(inkCount),
      quantityBracket
    );

    if (unitPrice == null) {
      return {
        pricingMode: "manual_quote",
        reason: "screenprint_price_not_found",
        unitPrice: null,
        totalPrice: null,
        requestedSize,
        chargedSize,
        quantityBracket,
      };
    }

    return {
      pricingMode: "automatic",
      technique,
      variant,
      requestedSize,
      chargedSize,
      quantity,
      quantityBracket,
      inkCount: String(inkCount),
      unitPrice,
      totalPrice: roundPrice(unitPrice * quantity),
    };
  }


  return {
    pricingMode: "manual_quote",
    reason: "technique_not_implemented_yet",
    unitPrice: null,
    totalPrice: null,
    requestedSize,
    chargedSize,
    quantityBracket,
  };

  
}

function roundPrice(value) {
  return Math.round((Number(value) + Number.EPSILON) * 10000) / 10000;
}