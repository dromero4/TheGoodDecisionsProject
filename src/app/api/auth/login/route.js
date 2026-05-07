import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { createSessionToken, getAuthCookieName } from "@/app/lib/auth";

export async function POST(request) {
  try {
    const body = await request.json();

    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");

    if (!email || !password) {
      return Response.json(
        { error: "Email y contraseña son obligatorios." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
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
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });

    response.cookies.set(getAuthCookieName(), token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("LOGIN_ERROR:", error);

    return Response.json(
      { error: "Error iniciando sesión." },
      { status: 500 }
    );
  }
}