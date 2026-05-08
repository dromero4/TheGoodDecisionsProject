export function buildOrderSummary(items) {
  return items.map((item) => ({
    productId: item.productId,
    productName: item.productName,
    category: item.category,
    selectedColor: item.selectedColor,
    sizes: item.sizes,
    totalUnits: item.totalUnits,
    garmentBaseTotal: item.garmentBaseTotal,
    customizationTotal: item.customizationTotal || 0,
    finalTotal: item.finalTotal,

    customization: item.customization
      ? {
          placements: item.customization.placements?.map((placement) => ({
            zoneLabel: placement.zoneLabel,
            techniqueLabel: placement.techniqueLabel,
            requestedSize: placement.requestedSize,
            chargedSize: placement.chargedSize,
            totalPrice: placement.totalPrice,
          })),
        }
      : null,
  }));
}