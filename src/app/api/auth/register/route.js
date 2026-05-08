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
  validateRegisterPayload,
} from "@/app/lib/auth/authValidation";

import { sanitizeUser } from "@/app/lib/auth/sanitizeUser";

export async function POST(request) {
  try {
    const body = await request.json();

    const email = normalizeEmail(body.email);
    const password = String(body.password || "");
    const name = String(body.name || "").trim();

    validateRegisterPayload({ email, password });

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return Response.json(
        { error: "Ya existe una cuenta con este email." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name: name || null,
      },
      include: {
        address: true,
      },
    });

    const token = await createSessionToken(user.id);

    const response = NextResponse.json({
      user: sanitizeUser(user),
    });

    response.cookies.set(AUTH_COOKIE_NAME, token, AUTH_COOKIE_OPTIONS);

    return response;
  } catch (error) {
    console.error("REGISTER_ERROR:", error);

    return Response.json(
      {
        error: error.message || "Error creando la cuenta.",
      },
      { status: 500 }
    );
  }
}