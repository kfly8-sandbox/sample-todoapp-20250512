import { describe, expect, it } from 'bun:test';

import { Todo } from './todo';
import { TodoRepositoryImpl } from './todoRepository';
import { drizzle } from 'drizzle-orm/node-postgres';
import { todos } from './schema';
import { eq } from 'drizzle-orm';

describe('TodoRepositoryImpl#add', () => {
  it('should add a todo', async () => {
    const db = drizzle(process.env.DATABASE_URL!)
    const repo = new TodoRepositoryImpl(db);

    const todo = Todo.build({ title: 'Test Todo', description: 'Test Description' })._unsafeUnwrap();

    await repo.add(todo);

    const result = await db.select().from(todos).where(eq(todos.id, todo.id)).execute();
    expect(result).toHaveLength(1);

    const row = result[0];
    expect(row.id).toBe(todo.id);
    expect(row.title).toBe(todo.title);
    expect(row.description).toBe(todo.description);
    expect(row.done).toBe(todo.done);
  })
})
