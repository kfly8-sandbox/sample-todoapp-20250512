import { ok } from 'neverthrow';
import type { TodoRepository } from './todoApp';
import { Todo } from './todo';
import { todos } from './schema';

import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export class TodoRepositoryImpl implements TodoRepository {
  constructor(private db: NodePgDatabase | NeonHttpDatabase) { }

  async add(todo: Todo) {
    await this.db.insert(todos).values({
      id: todo.id,
      title: todo.title,
      description: todo.description,
      done: todo.done,
    })

    return ok()
  }

  async getAll() {
    const rows = await this.db.select().from(todos)
    return ok(rows.map((row) => Todo.fromRaw(row)))
  }
}
