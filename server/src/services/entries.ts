import { eq, and, gte, lte } from 'drizzle-orm';
import { db } from '../db/index.js';
import { habitEntries } from '../db/schema.js';

export async function listEntries(filters: {
  from: string;
  to: string;
  habitId?: number;
}) {
  const conditions = [
    gte(habitEntries.date, filters.from),
    lte(habitEntries.date, filters.to),
  ];

  if (filters.habitId) {
    conditions.push(eq(habitEntries.habitId, filters.habitId));
  }

  return db.select().from(habitEntries).where(and(...conditions));
}

export async function upsertEntry(data: {
  habitId: number;
  date: string;
  status: string;
  note?: string;
}) {
  const result = await db
    .insert(habitEntries)
    .values(data)
    .onConflictDoUpdate({
      target: [habitEntries.habitId, habitEntries.date],
      set: { status: data.status, note: data.note },
    })
    .returning();
  return result[0];
}

export async function deleteEntry(id: number) {
  const result = await db.delete(habitEntries).where(eq(habitEntries.id, id)).returning();
  return result[0] ?? null;
}
