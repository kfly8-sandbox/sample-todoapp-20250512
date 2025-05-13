import { ok, err } from 'neverthrow';

import { z } from 'zod';

import { generateId } from './helper';

export const todoIdSchema = z.string().brand('TodoId');
export type TodoId = z.infer<typeof todoIdSchema>;
export const createTodoId = () => generateId<TodoId>()

export const TodoSchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(255),
  description: z.string().min(0).max(1000),
  done: z.boolean(),
})

export type TodoRaw = z.infer<typeof TodoSchema>

export class Todo {
  constructor(
    readonly id: TodoId,
    readonly title: string,
    readonly description: string,
    readonly done: boolean
  ) {}

  private static fromRaw(raw: TodoRaw) {
    return new Todo(raw.id as TodoId, raw.title, raw.description, raw.done);
  }

  /**
  * Creates a new Todo object.
  */
  static build({ title, description } : { title: string, description: string }) {
    const todoRaw = {
      id: createTodoId(),
      title,
      description,
      done: false,
    }

    const parsed = TodoSchema.safeParse(todoRaw);
    if (!parsed.success) {
      return err(parsed.error);
    }

    return ok(Todo.fromRaw(parsed.data));
  }
}
