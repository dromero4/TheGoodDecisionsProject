export function getMissingShippingFields(address) {
  const requiredFields = [
    { key: "fullName", label: "nombre completo" },
    { key: "phone", label: "teléfono" },
    { key: "street", label: "calle" },
    { key: "number", label: "número" },
    { key: "postalCode", label: "código postal" },
    { key: "city", label: "ciudad" },
    { key: "province", label: "provincia" },
    { key: "country", label: "país" },
  ];

  return requiredFields.filter((field) => {
    return !String(address?.[field.key] || "").trim();
  });
}

export function validateCartBeforeCheckout({
  cartItems,
  cartQuantity,
  shippingAddress,
}) {
  const missingFields = getMissingShippingFields(shippingAddress);

  if (missingFields.length > 0) {
    return {
      valid: false,
      message: `Completa la dirección de entrega antes de continuar. Falta: ${missingFields
        .map((field) => field.label)
        .join(", ")}.`,
    };
  }

  if (cartItems.length > 10) {
    return {
      valid: false,
      message:
        "El pedido tiene demasiados productos diferentes. Reduce el carrito o solicita presupuesto manual.",
    };
  }

  if (cartQuantity > 300) {
    return {
      valid: false,
      message: "Para pedidos de más de 300 unidades, solicita presupuesto manual.",
    };
  }

  return {
    valid: true,
    message: "",
  };
}