import { eq, sql, and, desc, gte, lte } from 'drizzle-orm';
import { db } from '../db/index.js';
import { habits, habitEntries } from '../db/schema.js';
import { format, subDays, startOfYear, endOfYear, subWeeks, startOfWeek, endOfWeek } from 'date-fns';

export async function getOverview() {
  const allHabits = await db.select().from(habits).where(eq(habits.isArchived, false));
  const totalHabits = allHabits.length;

  const thirtyDaysAgo = format(subDays(new Date(), 30), 'yyyy-MM-dd');
  const today = format(new Date(), 'yyyy-MM-dd');

  const entries = await db.select().from(habitEntries)
    .where(and(gte(habitEntries.date, thirtyDaysAgo), lte(habitEntries.date, today)));

  const doneCount = entries.filter(e => e.status === 'done').length;
  const totalEntries = entries.length;
  const completionRate = totalEntries > 0 ? Math.round((doneCount / totalEntries) * 100) : 0;

  return { totalHabits, completionRate, totalEntries, doneCount };
}

export async function getHabitStats(habitId: number) {
  const entries = await db.select().from(habitEntries)
    .where(eq(habitEntries.habitId, habitId))
    .orderBy(desc(habitEntries.date));

  const doneEntries = entries.filter(e => e.status === 'done');
  const totalEntries = entries.length;
  const completionRate = totalEntries > 0 ? Math.round((doneEntries.length / totalEntries) * 100) : 0;

  const currentStreak = calculateCurrentStreak(entries);
  const longestStreak = calculateLongestStreak(entries);

  return { completionRate, currentStreak, longestStreak, totalEntries, doneCount: doneEntries.length };
}

export async function getHeatmapData(year: number) {
  const from = format(startOfYear(new Date(year, 0, 1)), 'yyyy-MM-dd');
  const to = format(endOfYear(new Date(year, 0, 1)), 'yyyy-MM-dd');

  const result = await db
    .select({
      date: habitEntries.date,
      completed: sql<number>`count(*) filter (where ${habitEntries.status} = 'done')`,
      total: sql<number>`count(*)`,
    })
    .from(habitEntries)
    .where(and(gte(habitEntries.date, from), lte(habitEntries.date, to)))
    .groupBy(habitEntries.date)
    .orderBy(habitEntries.date);

  return result;
}

export async function getTrends() {
  const weeks = 12;
  const results = [];

  for (let i = weeks - 1; i >= 0; i--) {
    const weekStart = format(startOfWeek(subWeeks(new Date(), i)), 'yyyy-MM-dd');
    const weekEnd = format(endOfWeek(subWeeks(new Date(), i)), 'yyyy-MM-dd');

    const entries = await db.select().from(habitEntries)
      .where(and(gte(habitEntries.date, weekStart), lte(habitEntries.date, weekEnd)));

    const done = entries.filter(e => e.status === 'done').length;
    const total = entries.length;
    const rate = total > 0 ? Math.round((done / total) * 100) : 0;

    results.push({ weekStart, rate, done, total });
  }

  return results;
}

function calculateCurrentStreak(entries: { date: string; status: string }[]): number {
  let streak = 0;
  const today = new Date();

  for (let i = 0; i < 365; i++) {
    const dateStr = format(subDays(today, i), 'yyyy-MM-dd');
    const entry = entries.find(e => e.date === dateStr);
    if (entry?.status === 'done') {
      streak++;
    } else if (entry?.status === 'skipped') {
      continue;
    } else {
      break;
    }
  }

  return streak;
}

function calculateLongestStreak(entries: { date: string; status: string }[]): number {
  const doneEntries = entries
    .filter(e => e.status === 'done')
    .map(e => e.date)
    .sort();

  if (doneEntries.length === 0) return 0;

  let longest = 1;
  let current = 1;

  for (let i = 1; i < doneEntries.length; i++) {
    const prev = new Date(doneEntries[i - 1]);
    const curr = new Date(doneEntries[i]);
    const diffDays = Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      current++;
      longest = Math.max(longest, current);
    } else {
      current = 1;
    }
  }

  return longest;
}
