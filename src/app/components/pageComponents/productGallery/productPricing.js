export function getTierUnitPrice(price, totalUnits) {
  if (!price) return 0;

  if (totalUnits >= 1000) {
    return Number(price.gt1000 ?? price.gt500 ?? price.gt100 ?? price.gt10 ?? price.unit ?? 0);
  }

  if (totalUnits >= 500) {
    return Number(price.gt500 ?? price.gt100 ?? price.gt10 ?? price.unit ?? 0);
  }

  if (totalUnits >= 100) {
    return Number(price.gt100 ?? price.gt10 ?? price.unit ?? 0);
  }

  if (totalUnits >= 10) {
    return Number(price.gt10 ?? price.unit ?? 0);
  }

  return Number(price.unit ?? 0);
}

export function buildBasePriceBreakdown({
  sizeQty,
  variants,
  selectedColor,
  totalUnits,
}) {
  return Object.entries(sizeQty)
    .filter(([, qty]) => Number(qty) > 0)
    .map(([size, qty]) => {
      const variant = (variants ?? []).find(
        (v) => v.color === selectedColor && v.size === size
      );

      const price = variant?.prices?.[0] ?? null;
      const unitPrice = getTierUnitPrice(price, totalUnits);
      const quantity = Number(qty) || 0;

      return {
        size,
        quantity,
        unitPrice,
        total: unitPrice * quantity,
      };
    });
}

export function getGarmentBaseTotal(basePriceBreakdown) {
  return basePriceBreakdown.reduce((sum, item) => sum + item.total, 0);
}