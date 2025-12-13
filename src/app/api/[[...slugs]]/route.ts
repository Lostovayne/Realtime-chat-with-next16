import { redis } from "@/lib/redis";
import { Elysia } from "elysia";
import { nanoid } from "nanoid";

const ROOM_TTL_SECONDS = 60 * 60 * 10;

const rooms = new Elysia({ prefix: "/rooms" }).post("/create", async () => {
  try {
    const roomId = nanoid();

    await redis.hset(`meta:${roomId}`, {
      connected: [],
      createdAt: Date.now(),
    });

    await redis.expire(`meta:${roomId}`, ROOM_TTL_SECONDS);
    return { roomId };
  } catch (error: unknown) {
    return {
      error: error instanceof Error ? error.message : "Unknown error",
      status: 500,
    };
  }
});

// Router Principal
const app = new Elysia({ prefix: "/api" }).use(rooms);
export type App = typeof app;

export const GET = (req: Request) => app.fetch(req);
export const POST = (req: Request) => app.fetch(req);
