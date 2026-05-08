// Funciones para crear y verificar tokens JWT para la sesion de usuario.

import { SignJWT, jwtVerify } from "jose";

// AUTH_SECRET es una cadena creada mediante una comanda de PowerShell como herramienta
// de seguridad para firmar los tokens JWT. No debe ser compartida ni expuesta en el código fuente.
function getSecret() {
  const secret = process.env.AUTH_SECRET;

  if (!secret) {
    throw new Error("AUTH_SECRET is not configured");
  }

  return new TextEncoder().encode(secret);
}

// Creamos el token JWT con el userId del usuario autenticado.
export async function createSessionToken(userId) {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

// Finalmente verificamos el token JWT recibido en las solicitudes para autenticar al usaurio.
export async function verifySessionToken(token) {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload;
  } catch {
    return null;
  }
}