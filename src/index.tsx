import { Hono } from 'hono'
import type { Context } from 'hono'
import { env } from 'hono/adapter'
import { renderer } from './renderer'
import { Client } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';

import { TodoRepositoryImpl } from './todoRepository'
import { TodoApp } from './todoApp'

const app = new Hono()

const connectDatabase = async (c: Context) => {
  const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c)
  const client = new Client(DATABASE_URL);
  await client.connect();
  return client;
}

app.use(renderer)

app.get('/', (c) => {
  return c.render(<h1>Hello World!</h1>)
})

app.get('/api/todos', async (c) => {
  const client = await connectDatabase(c)
  const db = drizzle({ client })
  const repo = new TodoRepositoryImpl(db)
  const todoApp = new TodoApp(repo)

  const result = await todoApp.getTodos()
  if (result.isErr()) {
    return c.json({ error: result.error.message }, 500)
  }

  c.executionCtx.waitUntil(client.end())

  return c.json(result.value)
})

app.post('/api/todos', async (c) => {
  const client = await connectDatabase(c)
  const db = drizzle({ client })
  const repo = new TodoRepositoryImpl(db)
  const todoApp = new TodoApp(repo)

  const { title, description } = await c.req.json()

  const result = await todoApp.addTodo(title, description)
  if (result.isErr()) {
    return c.json({ error: result.error.message }, 400)
  }

  c.executionCtx.waitUntil(client.end())

  return c.json(result.value)
})

export default app
