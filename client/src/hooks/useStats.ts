import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../api/client';
import type { StatsOverview, HabitStats, HeatmapEntry, TrendEntry } from '../types';

export function useStatsOverview() {
  return useQuery({
    queryKey: ['stats', 'overview'],
    queryFn: () => apiFetch<StatsOverview>('/stats/overview'),
  });
}

export function useHabitStats(habitId: number) {
  return useQuery({
    queryKey: ['stats', 'habit', habitId],
    queryFn: () => apiFetch<HabitStats>(`/stats/habits/${habitId}`),
  });
}

export function useHeatmap(year: number) {
  return useQuery({
    queryKey: ['stats', 'heatmap', year],
    queryFn: () => apiFetch<HeatmapEntry[]>(`/stats/heatmap?year=${year}`),
  });
}

export function useTrends() {
  return useQuery({
    queryKey: ['stats', 'trends'],
    queryFn: () => apiFetch<TrendEntry[]>('/stats/trends'),
  });
}
