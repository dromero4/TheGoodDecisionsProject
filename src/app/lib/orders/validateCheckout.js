/*
Validaciones de seguridad para el proceso del checkout / pago
para evitar errores comunes que puedan surgir al crear la sesión de Stripe.

Se validan en el backend para no depender de la integridad de los datos que vienen del frontend.
*/

export function validateCheckoutPayload({ items, shippingAddress }) {

  // Evitamos poder crear la sesión de Stripe con un carrito vacío
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("El carrito está vacío.");
  }

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

  // Verificamos que los datos esten completos y no sean solo espacios en blanco.
  const missingFields = requiredAddressFields.filter((field) => {
    return !String(shippingAddress?.[field] || "").trim();
  });

  if (missingFields.length > 0) {
    throw new Error("Faltan datos obligatorios en la dirección de entrega.");
  }
}