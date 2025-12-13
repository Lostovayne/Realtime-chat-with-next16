import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";
import { redis } from "./lib/redis";

export const proxy = async (req: NextRequest) => {
  // Validar que el usuario pueda entrar a la sala solo si tiene el roomId
  const pathname = req.nextUrl.pathname;
  const roomMatch = pathname.match(/^\/room\/([^/]+)$/);
  if (!roomMatch) return NextResponse.redirect(new URL("/", req.url));

  const roomId = roomMatch[1];
  const meta = await redis.hgetall<{ connected: string[]; createdAt: number }>(
    `meta:${roomId}`
  );
  if (!meta || !meta.createdAt) {
    return NextResponse.redirect(new URL("/?error=room-not-found", req.url));
  }

  // revisar si ya tiene un token de autenticacion
  const existingToken = req.cookies.get("x-auth-token")?.value;

  // revisar si el usuario ya esta conectado
  if (existingToken && meta.connected?.includes(existingToken)) {
    return NextResponse.next();
  }

  if (meta.connected.length >= 2) {
    return NextResponse.redirect(new URL("/?error=room-full", req.url));
  }

  const response = NextResponse.next();
  const token = nanoid();

  response.cookies.set("x-auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  await redis.hset(`meta:${roomId}`, {
    ...meta,
    connected: [...(meta.connected || []), token],
  });

  return response;
};

export const config = {
  matcher: "/room/:path*",
};
