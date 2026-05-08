export function validateCheckoutPayload({ items, shippingAddress }) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("El carrito está vacío.");
  }

  if (items.length > 10) {
    throw new Error(
      "El pedido tiene demasiados productos diferentes. Reduce el carrito o solicita presupuesto manual."
    );
  }

  const totalUnits = items.reduce((sum, item) => {
    return sum + Number(item.totalUnits || 0);
  }, 0);

 

  const requiredAddressFields = [
    "fullName",
    "phone",
    "street",
    "number",
    "postalCode",
    "city",
    "province",
    "country",
  ];

  const missingFields = requiredAddressFields.filter((field) => {
    return !String(shippingAddress?.[field] || "").trim();
  });

  if (missingFields.length > 0) {
    throw new Error("Faltan datos obligatorios en la dirección de entrega.");
  }
}