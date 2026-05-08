// Endpoint para obtenet y/o actualizar el perfil del usuario autenticado.

import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

// Devuelve el perfil del usuario. En caso de no estar autenticado, devuelve un error 401 que posteriormente
// será manejado por el cliente para redirigir al usuario a la página de login.
export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json({ user: null }, { status: 401 });
  }

  return Response.json({ user });
}

// Actualiza los datos del perfil del usuario. Requiere autenticación. En caso de no estar autenticado, devuelve un error 401.
export async function PATCH(request) {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    // Recuperamos los datos del cuerpo de la petición
    const body = await request.json();

    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        name: body.name ?? null,
        phone: body.phone ?? null,
        address: {
          // UPSERT: Sirve para crear (si no esta creado) o actualizar (si ya existe) la dirección del usuario.
          upsert: {
            create: {
              fullName: body.address?.fullName ?? null,
              phone: body.address?.phone ?? null,
              street: body.address?.street ?? null,
              number: body.address?.number ?? null,
              floorDoor: body.address?.floorDoor ?? null,
              postalCode: body.address?.postalCode ?? null,
              city: body.address?.city ?? null,
              province: body.address?.province ?? null,
              country: body.address?.country ?? "Spain",
              additionalInfo: body.address?.additionalInfo ?? null,
            },
            update: {
              fullName: body.address?.fullName ?? null,
              phone: body.address?.phone ?? null,
              street: body.address?.street ?? null,
              number: body.address?.number ?? null,
              floorDoor: body.address?.floorDoor ?? null,
              postalCode: body.address?.postalCode ?? null,
              city: body.address?.city ?? null,
              province: body.address?.province ?? null,
              country: body.address?.country ?? "Spain",
              additionalInfo: body.address?.additionalInfo ?? null,
            },
          },
        },
      },
      include: {
        address: true,
      },
    });

    return Response.json({
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        phone: updatedUser.phone,
        address: updatedUser.address,
      },
    });
  } catch (error) {
    console.error("UPDATE_PROFILE_ERROR:", error);

    return Response.json(
      { error: "Error actualizando el perfil." },
      { status: 500 }
    );
  }
}