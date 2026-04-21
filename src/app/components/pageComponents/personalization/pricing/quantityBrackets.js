// src/app/components/pageComponents/personalization/pricing/quantityBrackets.js

/**
 * Tramos estándar de cantidad.
 * Luego, si alguna técnica necesita tramos distintos, lo podremos ampliar.
 */
export const DEFAULT_QUANTITY_BRACKETS = [
  10, 15, 20, 25, 30, 35, 40, 45, 50,
  60, 70, 80, 90, 100, 200, 300, 400, 500, 1000
];

/**
 * Devuelve el tramo de cantidad que se debe usar.
 *
 * Regla:
 * - si la cantidad existe exacta, usa esa
 * - si no existe, usa el siguiente tramo superior
 * - si supera el máximo tramo, usa el último disponible
 *
 * Ejemplos:
 * 10  -> 10
 * 12  -> 15
 * 26  -> 50
 * 520 -> 500
 */
export function getQuantityBracket(
  quantity,
  brackets = DEFAULT_QUANTITY_BRACKETS
) {
  const normalizedQuantity = Number(quantity);

  if (!Number.isFinite(normalizedQuantity) || normalizedQuantity <= 0) {
    return null;
  }

  const sortedBrackets = [...brackets]
    .map(Number)
    .filter((value) => Number.isFinite(value) && value > 0)
    .sort((a, b) => a - b);

  if (!sortedBrackets.length) {
    return null;
  }

  const exactMatch = sortedBrackets.find(
    (bracket) => bracket === normalizedQuantity
  );

  if (exactMatch) {
    return exactMatch;
  }

  const nextHigherBracket = sortedBrackets.find(
    (bracket) => normalizedQuantity <= bracket
  );

  if (nextHigherBracket) {
    return nextHigherBracket;
  }

  return sortedBrackets[sortedBrackets.length - 1];
}

/**
 * Devuelve info más detallada del tramo aplicado.
 */
export function getQuantityBracketInfo(
  quantity,
  brackets = DEFAULT_QUANTITY_BRACKETS
) {
  const appliedBracket = getQuantityBracket(quantity, brackets);

  if (!appliedBracket) {
    return {
      requestedQuantity: quantity,
      appliedBracket: null,
      isExactMatch: false,
      mode: "invalid",
    };
  }

  return {
    requestedQuantity: quantity,
    appliedBracket,
    isExactMatch: Number(quantity) === appliedBracket,
    mode: Number(quantity) === appliedBracket ? "exact" : "rounded_up",
  };
}   