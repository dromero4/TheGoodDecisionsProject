import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { createSessionToken, getAuthCookieName } from "@/app/lib/auth";

export async function POST(request) {
  try {
    const body = await request.json();

    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const name = String(body.name || "").trim();

    if (!email || !password) {
      return Response.json(
        { error: "Email y contraseña son obligatorios." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return Response.json(
        { error: "La contraseña debe tener al menos 6 caracteres." },
        { status: 400 }
      );
    }

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
    });

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
    console.error("REGISTER_ERROR:", error);

    return Response.json(
      { error: "Error creando la cuenta." },
      { status: 500 }
    );
  }
}