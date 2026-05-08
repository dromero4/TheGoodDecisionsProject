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