/*
Convierte los datos de los items del carrito en un resumen de orden que incluye detalles 
relevantes para cada producto, como el ID, nombre, categoría, color seleccionado, 
tallas, unidades totales, costos y personalización. Esto facilita la presentación de un 
resumen claro y conciso de la orden para el usuario o para su procesamiento posterior.
*/

export function buildOrderSummary(items = []) {
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
    /*
    Si el producto tiene personalización, guardamos solo la información necesaria
    para mostrarla en el resumen del pedido.
    */
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