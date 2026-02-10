import { pgTable, serial, varchar, text, integer, boolean, date, timestamp, unique, index } from 'drizzle-orm/pg-core';

export const habits = pgTable('habits', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  color: varchar('color', { length: 7 }).default('#6366f1'),
  icon: varchar('icon', { length: 50 }),
  frequencyType: varchar('frequency_type', { length: 20 }).notNull().default('daily'),
  frequencyDays: integer('frequency_days').array(),
  targetPerWeek: integer('target_per_week'),
  isArchived: boolean('is_archived').default(false),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => [
  index('idx_habits_archived').on(table.isArchived),
]);

export const habitEntries = pgTable('habit_entries', {
  id: serial('id').primaryKey(),
  habitId: integer('habit_id').notNull().references(() => habits.id, { onDelete: 'cascade' }),
  date: date('date').notNull(),
  status: varchar('status', { length: 20 }).notNull(),
  note: text('note'),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => [
  unique('uq_entries_habit_date').on(table.habitId, table.date),
  index('idx_entries_date').on(table.date),
  index('idx_entries_habit_status').on(table.habitId, table.status),
]);
