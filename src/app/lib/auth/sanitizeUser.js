//Funcion para limpiar los datos del usuario antes de enviarlos al cliente,
// haciendo que solo se envíen los campos necesarios y evitando exponer información sensible.

export function sanitizeUser(user) {
  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    phone: user.phone,
    address: user.address || null,
  };
}