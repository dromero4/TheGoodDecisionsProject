export function buildStripeLineItems(items = []) {
  return items.map((item) => {
    const amount = Math.round(Number(item.finalTotal || 0) * 100);

    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error(
        `Importe inválido para ${item.productName || "producto"}: ${item.finalTotal}`
      );
    }

    return {
      price_data: {
        currency: "eur",
        product_data: {
          name: `${item.productId || ""} - ${item.productName || "Producto"}`,
          description: [
            item.selectedColor ? `Color: ${item.selectedColor}` : null,
            item.totalUnits ? `Unidades: ${item.totalUnits}` : null,
            item.customization ? "Con personalización" : "Sin personalización",
          ]
            .filter(Boolean)
            .join(" · "),
        },
        unit_amount: amount,
      },
      quantity: 1,
    };
  });
}