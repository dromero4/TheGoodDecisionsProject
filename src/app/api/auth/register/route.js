// Endpoint de registro de usuario.
// Crea el usuario, hashea la contraseña y te loguea automaticamente.

import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

import {
  AUTH_COOKIE_NAME,
  AUTH_COOKIE_OPTIONS,
  createSessionToken,
} from "@/app/lib/auth";

import {
  validateRegister,
} from "@/app/lib/validations/authValidation";

import { sanitizeUser } from "@/app/lib/auth/sanitizeUser";

export async function POST(request) {
  try {
    const body = await request.json();

    const email = String(body.email);
    const password = String(body.password || "");
    const name = String(body.name || "").trim();

    // Verificaciones básicas. Si el email o la contraseña no son válidos, 
    // se lanzará un error que será capturado en el catch.
    validateRegister({ email, password });

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    // Verificaciones por si el usuario ya existe.
    if (existingUser) {
      return Response.json(
        { error: "Ya existe una cuenta con este email." },
        { status: 400 }
      );
    }

    //Verificamos si el correo es correcto
    if(!email.contains("@")) return Response.json({
      error: "El email no es valido",
      status: 400
    });

    // Momento de hashear el password y crear el usuario en la base de datos.
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name: name,
      },
      include: {
        address: true,
      },
    });
    

    // Creamos el token de sesión JWT con el ID del usuario.
    const token = await createSessionToken(user.id);

    const response = NextResponse.json({
      user: sanitizeUser(user),
    });

    response.cookies.set(AUTH_COOKIE_NAME, token, AUTH_COOKIE_OPTIONS);

    return response;
  } catch (error) {
    return NextResponse.json({ error: "Error creando la cuenta. Por favor, inténtalo de nuevo." }, { status: 500 });
  }
}