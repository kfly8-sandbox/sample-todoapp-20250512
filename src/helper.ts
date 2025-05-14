import { uuidv7 } from 'uuidv7';
import type { Context } from 'hono';
import { env } from 'hono/adapter'
import { Client } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';

export function generateId<T extends string>(): T {
  return uuidv7() as T
}

export const createDatabase = (c: Context) => {
  const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c)
  const client = new Client(DATABASE_URL);
  return drizzle({ client })
}
