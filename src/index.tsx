import { Hono } from 'hono'
import type { Context } from 'hono'
import { env } from 'hono/adapter'
import { renderer } from './renderer'
import { drizzle } from 'drizzle-orm/neon-http';

import { TodoRepositoryImpl } from './todoRepository'
import { TodoApp } from './todoApp'

const app = new Hono()

const newTodoApp = (c: Context) => {
  const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c)
  const db = drizzle(DATABASE_URL)
  const todoRepository = new TodoRepositoryImpl(db)
  return new TodoApp(todoRepository)
}

app.use(renderer)

app.get('/', (c) => {
  return c.render(<h1>Hello!</h1>)
})

app.get('/api/todos', async (c) => {
  const todoApp = newTodoApp(c)

  const result = await todoApp.getTodos()
  if (result.isErr()) {
    return c.json({ error: result.error.message }, 500)
  }

  return c.json(result.value)
})

app.post('/api/todos', async (c) => {
  const todoApp = newTodoApp(c)

  const { title, description } = await c.req.json()

  const result = await todoApp.addTodo(title, description)
  if (result.isErr()) {
    return c.json({ error: result.error.message }, 400)
  }

  return c.json(result.value)
})


export default app
