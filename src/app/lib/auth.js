import { cookies } from "next/headers";
import { prisma } from "@/app/lib/prisma";

import { AUTH_COOKIE_NAME } from "@/app/lib/auth/authCookies";
import { verifySessionToken } from "@/app/lib/auth/authSession";
import { sanitizeUser } from "@/app/lib/auth/sanitizeUser";

export { AUTH_COOKIE_NAME };
export { AUTH_COOKIE_OPTIONS } from "@/app/lib/auth/authCookies";
export { createSessionToken } from "@/app/lib/auth/authSession";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) return null;

  const payload = await verifySessionToken(token);

  if (!payload?.userId) return null;

  const user = await prisma.user.findUnique({
    where: {
      id: payload.userId,
    },
    include: {
      address: true,
    },
  });

  return sanitizeUser(user);
}