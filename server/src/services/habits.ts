import { eq, asc } from 'drizzle-orm';
import { db } from '../db/index.js';
import { habits } from '../db/schema.js';

export async function listHabits(includeArchived = false) {
  if (includeArchived) {
    return db.select().from(habits).orderBy(asc(habits.sortOrder), asc(habits.createdAt));
  }
  return db.select().from(habits)
    .where(eq(habits.isArchived, false))
    .orderBy(asc(habits.sortOrder), asc(habits.createdAt));
}

export async function getHabit(id: number) {
  const result = await db.select().from(habits).where(eq(habits.id, id));
  return result[0] ?? null;
}

export async function createHabit(data: {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  frequencyType?: string;
  frequencyDays?: number[];
  targetPerWeek?: number;
}) {
  const result = await db.insert(habits).values(data).returning();
  return result[0];
}

export async function updateHabit(id: number, data: {
  name?: string;
  description?: string;
  color?: string;
  icon?: string;
  frequencyType?: string;
  frequencyDays?: number[];
  targetPerWeek?: number;
  sortOrder?: number;
}) {
  const result = await db.update(habits)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(habits.id, id))
    .returning();
  return result[0] ?? null;
}

export async function toggleArchive(id: number) {
  const habit = await getHabit(id);
  if (!habit) return null;
  const result = await db.update(habits)
    .set({ isArchived: !habit.isArchived, updatedAt: new Date() })
    .where(eq(habits.id, id))
    .returning();
  return result[0];
}

export async function deleteHabit(id: number) {
  const result = await db.delete(habits).where(eq(habits.id, id)).returning();
  return result[0] ?? null;
}

export async function reorderHabits(orderedIds: number[]) {
  const updates = orderedIds.map((id, index) =>
    db.update(habits).set({ sortOrder: index }).where(eq(habits.id, id))
  );
  await Promise.all(updates);
}
