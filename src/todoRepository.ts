import { ok } from 'neverthrow';
import type { TodoRepository } from './todoApp';
import { Todo } from './todo';
import { todos } from './schema';

import type { NodePgDatabase } from 'drizzle-orm/node-postgres';

export class TodoRepositoryImpl implements TodoRepository {
  constructor(private db: NodePgDatabase) { }

  async add(todo: Todo) {
    await this.db.insert(todos).values({
      id: todo.id,
      title: todo.title,
      description: todo.description,
      done: todo.done,
    })

    return ok()
  }
}
