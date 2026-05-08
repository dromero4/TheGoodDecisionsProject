export function getCartItemSignature(item) {
  const sizesSignature = (item.sizes || [])
    .map((sizeItem) => `${sizeItem.size}:${sizeItem.quantity}`)
    .sort()
    .join("|");

  const customizationSignature = item.customization
    ? JSON.stringify({
        placements: item.customization.placements?.map((placement) => ({
          zone: placement.zone,
          technique: placement.technique,
          techniqueLabel: placement.techniqueLabel,
          requestedSize: placement.requestedSize,
          chargedSize: placement.chargedSize,
          totalPrice: placement.totalPrice,
        })),
        customizationTotal: item.customization.customizationTotal,
      })
    : "no-customization";

  return [
    item.productId,
    item.selectedColor,
    sizesSignature,
    customizationSignature,
  ].join("::");
}