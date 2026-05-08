/*
Punto central de la autenticación de la aplicación, donde se definen las funciones para 
gestionar la sesión del usuario
*/
import { cookies } from "next/headers";
import { prisma } from "@/app/lib/prisma";

import { AUTH_COOKIE_NAME } from "@/app/lib/auth/authCookies";
import { verifySessionToken } from "@/app/lib/auth/authSession";
import { sanitizeUser } from "@/app/lib/auth/sanitizeUser";

export { AUTH_COOKIE_NAME };
export { AUTH_COOKIE_OPTIONS } from "@/app/lib/auth/authCookies";
export { createSessionToken } from "@/app/lib/auth/authSession";

export async function getCurrentUser() {

  // Obtenemos el token de la cookie de autenticación y lo verificamos para obtener el ID del usuario
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) return null;

  // Validamos el token JWT para comprobar que la sesión es válida.
  const payload = await verifySessionToken(token);

  if (!payload?.userId) return null;

  // Buscamos el usuario completo en la base de datos
  const user = await prisma.user.findUnique({
    where: {
      id: payload.userId,
    },
    include: {
      address: true,
    },
  });

  // Devolvemos una versión "saneada" del usuario, sin datos sensibles como el mail, contraseña ni campos
  // que no necesitamos en el frontend para mostrar el perfil o gestionar la sesión.
  return sanitizeUser(user);
}