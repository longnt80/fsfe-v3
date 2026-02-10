import { apiFetch } from './client';
import type { HabitEntry } from '../types';

export function fetchEntries(from: string, to: string, habitId?: number) {
  let query = `?from=${from}&to=${to}`;
  if (habitId) query += `&habitId=${habitId}`;
  return apiFetch<HabitEntry[]>(`/entries${query}`);
}

export function upsertEntry(data: {
  habitId: number;
  date: string;
  status: 'done' | 'skipped' | 'missed';
  note?: string;
}) {
  return apiFetch<HabitEntry>('/entries', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteEntry(id: number) {
  return apiFetch<HabitEntry>(`/entries/${id}`, { method: 'DELETE' });
}
