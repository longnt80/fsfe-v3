import { apiFetch } from './client';
import type { Habit } from '../types';

export function fetchHabits(archived = false) {
  const query = archived ? '?archived=true' : '';
  return apiFetch<Habit[]>(`/habits${query}`);
}

export function fetchHabit(id: number) {
  return apiFetch<Habit>(`/habits/${id}`);
}

export function createHabit(data: {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  frequencyType?: string;
  frequencyDays?: number[];
  targetPerWeek?: number;
}) {
  return apiFetch<Habit>('/habits', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateHabit(id: number, data: Partial<Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>>) {
  return apiFetch<Habit>(`/habits/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export function toggleArchiveHabit(id: number) {
  return apiFetch<Habit>(`/habits/${id}/archive`, { method: 'PATCH' });
}

export function deleteHabit(id: number) {
  return apiFetch<Habit>(`/habits/${id}`, { method: 'DELETE' });
}
