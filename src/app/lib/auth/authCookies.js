export const AUTH_COOKIE_NAME = "tgd_session";

export const AUTH_COOKIE_OPTIONS = {
  httpOnly: true, // httpOnly evita que JavaScript del navegador pueda leer el token.
  secure: process.env.NODE_ENV === "production", // En produccion solo se envia la cookie mediante HTTPS.
  sameSite: "lax", // Esto reduce el riesgo de ataques CSRF al no enviar la cookie en solicitudes cross-site.
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // Sesión válida por 7 días.
};