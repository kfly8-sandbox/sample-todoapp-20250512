import * as t from 'drizzle-orm/pg-core';

import type { TodoId } from './todo';

const createdAt = t.timestamp("created_at").notNull().defaultNow();
const updatedAt = t.timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date());
const deletedAt = t.timestamp("deleted_at");

export const todos = t.pgTable('todos', {
  id: t.uuid('id').primaryKey().$type<TodoId>(),
  title: t.varchar('title').notNull(),
  description: t.text('description').notNull(),
  done: t.boolean('done').notNull(),
  createdAt,
  updatedAt,
  deletedAt,
})

