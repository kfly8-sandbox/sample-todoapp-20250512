import { ok, err } from 'neverthrow';
import type { Result } from 'neverthrow';

import { Todo } from './todo';

export interface TodoRepository {
  add(todo: Todo): Promise<Result<void, Error>>
}

export class TodoApp {
  constructor(private todoRepository: TodoRepository) {}

  /// Adds a new todo to the repository.
  async addTodo(title: string, description: string) {

    const result = Todo.build({ title, description });
    if (result.isErr()) {
      return err(result.error);
    }

    const saveResult = await this.todoRepository.add(result.value)
    if (saveResult.isErr()) {
      return err(saveResult.error);
    }

    return ok(result.value);
  }
}


