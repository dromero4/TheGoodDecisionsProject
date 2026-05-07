import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json({ user: null }, { status: 401 });
  }

  return Response.json({ user });
}

export async function PATCH(request) {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const body = await request.json();

    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        name: body.name ?? null,
        phone: body.phone ?? null,
        address: {
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