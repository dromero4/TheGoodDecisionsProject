// Endpoint para iniciar sesión.
// Valida las credenciales, crea una sesión y devuelve la información del usuario.

import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

import {
  AUTH_COOKIE_NAME,
  AUTH_COOKIE_OPTIONS,
  createSessionToken,
} from "@/app/lib/auth";

import {
  normalizeEmail,
  validateLoginPayload,
} from "@/app/lib/auth/authValidation";

import { sanitizeUser } from "@/app/lib/auth/sanitizeUser";

export async function POST(request) {
  try {
    const body = await request.json();

    const email = normalizeEmail(body.email);
    const password = String(body.password || "");

    validateLoginPayload({ email, password });

    // Recuperamos el usuario de la base de datos mediante el correo
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        address: true,
      },
    });

    // En caso de no haber encontrado el usuario o la contraseña no coincida, devolvemos un error genérico
    if (!user) {
      
      return Response.json(
        { error: "Credenciales incorrectas." },
        { status: 401 }
      );
    }

    // Recuperamos el hash de la contraseña y lo comparamos con la contraseña proporcionada
    const passwordIsValid = await bcrypt.compare(password, user.passwordHash);

    if (!passwordIsValid) {
      return Response.json(
        { error: "Credenciales incorrectas." },
        { status: 401 }
      );
    }

    // Creamos el token JWT para la sesión del usuario
    const token = await createSessionToken(user.id);

    const response = NextResponse.json({
      user: sanitizeUser(user),
    });

    response.cookies.set(AUTH_COOKIE_NAME, token, AUTH_COOKIE_OPTIONS);

    return response;
  } catch (error) {
    console.error("LOGIN_ERROR:", error);

    return Response.json(
      {
        error: error.message || "Error iniciando sesión.",
      },
      { status: 500 }
    );
  }
}