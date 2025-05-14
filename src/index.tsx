import { Hono } from 'hono'
import { renderer } from './renderer'

import { createDatabase } from './helper'
import { TodoRepositoryImpl } from './todoRepository'
import { TodoApp } from './todoApp'

const app = new Hono()

app.use(renderer)

app.get('/', (c) => {
  return c.render(<h1>Hello World!</h1>)
})

app.get('/api/todos', async (c) => {
  const db = createDatabase(c)
  const repo = new TodoRepositoryImpl(db)
  const todoApp = new TodoApp(repo)

  const result = await todoApp.getTodos()

  if (result.isErr()) {
    return c.json({ error: result.error.message }, 500)
  }

  return c.json(result.value)
})

app.post('/api/todos', async (c) => {
  const db = createDatabase(c)
  const repo = new TodoRepositoryImpl(db)
  const todoApp = new TodoApp(repo)

  const { title, description } = await c.req.json()

  const result = await todoApp.addTodo(title, description)
  if (result.isErr()) {
    return c.json({ error: result.error.message }, 400)
  }

  return c.json(result.value)
})

export default app
