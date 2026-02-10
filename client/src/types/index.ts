export interface Habit {
  id: number;
  name: string;
  description: string | null;
  color: string | null;
  icon: string | null;
  frequencyType: string;
  frequencyDays: number[] | null;
  targetPerWeek: number | null;
  isArchived: boolean | null;
  sortOrder: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface HabitEntry {
  id: number;
  habitId: number;
  date: string;
  status: 'done' | 'skipped' | 'missed';
  note: string | null;
  createdAt: string;
}

export interface StatsOverview {
  totalHabits: number;
  completionRate: number;
  totalEntries: number;
  doneCount: number;
}

export interface HabitStats {
  completionRate: number;
  currentStreak: number;
  longestStreak: number;
  totalEntries: number;
  doneCount: number;
}

export interface HeatmapEntry {
  date: string;
  completed: number;
  total: number;
}

export interface TrendEntry {
  weekStart: string;
  rate: number;
  done: number;
  total: number;
}
