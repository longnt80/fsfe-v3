import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as habitsApi from '../api/habits';

export function useHabits(archived = false) {
  return useQuery({
    queryKey: ['habits', { archived }],
    queryFn: () => habitsApi.fetchHabits(archived),
  });
}

export function useCreateHabit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: habitsApi.createHabit,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['habits'] }),
  });
}

export function useUpdateHabit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Parameters<typeof habitsApi.updateHabit>[1] }) =>
      habitsApi.updateHabit(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['habits'] }),
  });
}

export function useToggleArchive() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: habitsApi.toggleArchiveHabit,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['habits'] }),
  });
}

export function useDeleteHabit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: habitsApi.deleteHabit,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['habits'] }),
  });
}
