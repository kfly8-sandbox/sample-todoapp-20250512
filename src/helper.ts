import { uuidv7 } from 'uuidv7';
import type { Context } from 'hono';
import { env } from 'hono/adapter'
import { drizzle } from 'drizzle-orm/neon-http';

export function generateId<T extends string>(): T {
  return uuidv7() as T
}

export const createDatabase = (c: Context) => {
  const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c)
  return drizzle(DATABASE_URL)
}
