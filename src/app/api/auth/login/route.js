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

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        address: true,
      },
    });

    if (!user) {
      return Response.json(
        { error: "Credenciales incorrectas." },
        { status: 401 }
      );
    }

    const passwordIsValid = await bcrypt.compare(password, user.passwordHash);

    if (!passwordIsValid) {
      return Response.json(
        { error: "Credenciales incorrectas." },
        { status: 401 }
      );
    }

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