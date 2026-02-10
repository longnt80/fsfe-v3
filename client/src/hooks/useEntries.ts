import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as entriesApi from '../api/entries';

export function useEntries(from: string, to: string, habitId?: number) {
  return useQuery({
    queryKey: ['entries', { from, to, habitId }],
    queryFn: () => entriesApi.fetchEntries(from, to, habitId),
  });
}

export function useUpsertEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: entriesApi.upsertEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entries'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });
}

export function useDeleteEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: entriesApi.deleteEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entries'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });
}
