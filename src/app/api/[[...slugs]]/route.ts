import { redis } from "@/lib/redis";
import { Elysia } from "elysia";
import { nanoid } from "nanoid";
import z from "zod";
import { authMiddleware } from "./auth";

const ROOM_TTL_SECONDS = 60 * 10;

// Root for Rooms Router
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

// Router with Auth Middleware
const messages = new Elysia({ prefix: "/messages" }).use(authMiddleware).post(
  "/",
  ({ body, auth }) => {
    const { sender, text } = body;
  },
  {
    query: z.object({ roomId: z.string() }),
    body: z.object({
      sender: z.string().max(100),
      text: z.string().max(1000),
    }),
  },
);

// Router Principal
const app = new Elysia({ prefix: "/api" }).use(rooms).use(messages);
export type App = typeof app;

export const GET = (req: Request) => app.fetch(req);
export const POST = (req: Request) => app.fetch(req);
