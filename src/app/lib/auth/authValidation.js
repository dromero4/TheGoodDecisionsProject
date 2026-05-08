export function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

export function validateRegisterPayload({ email, password }) {
  if (!email || !password) {
    throw new Error("Email y contraseña son obligatorios.");
  }

  if (password.length < 6) {
    throw new Error("La contraseña debe tener al menos 6 caracteres.");
  }
}

export function validateLoginPayload({ email, password }) {
  if (!email || !password) {
    throw new Error("Email y contraseña son obligatorios.");
  }
}