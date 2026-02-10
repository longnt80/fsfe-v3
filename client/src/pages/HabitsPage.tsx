import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useHabits, useCreateHabit, useUpdateHabit, useToggleArchive, useDeleteHabit } from '../hooks/useHabits';
import { HabitCard } from '../components/habits/HabitCard';
import { HabitForm } from '../components/habits/HabitForm';
import type { Habit } from '../types';

export function HabitsPage() {
  const [showArchived, setShowArchived] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>();

  const { data: habits = [], isLoading } = useHabits(showArchived);
  const createMutation = useCreateHabit();
  const updateMutation = useUpdateHabit();
  const archiveMutation = useToggleArchive();
  const deleteMutation = useDeleteHabit();

  function handleSubmit(data: Parameters<typeof createMutation.mutate>[0]) {
    if (editingHabit) {
      updateMutation.mutate({ id: editingHabit.id, data }, {
        onSuccess: () => { setFormOpen(false); setEditingHabit(undefined); },
      });
    } else {
      createMutation.mutate(data, {
        onSuccess: () => setFormOpen(false),
      });
    }
  }

  function handleEdit(habit: Habit) {
    setEditingHabit(habit);
    setFormOpen(true);
  }

  function handleClose() {
    setFormOpen(false);
    setEditingHabit(undefined);
  }

  if (isLoading) {
    return <div className="text-center py-12 text-gray-500">Loading habits...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Habits</h1>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 text-sm text-gray-500">
            <input
              type="checkbox"
              checked={showArchived}
              onChange={e => setShowArchived(e.target.checked)}
              className="rounded"
            />
            Show archived
          </label>
          <button
            onClick={() => setFormOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500 text-white rounded-md text-sm font-medium hover:bg-indigo-600 transition-colors"
          >
            <Plus size={16} />
            New Habit
          </button>
        </div>
      </div>

      {habits.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No habits yet. Create one to get started!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {habits.map(habit => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onEdit={handleEdit}
              onArchive={id => archiveMutation.mutate(id)}
              onDelete={id => deleteMutation.mutate(id)}
            />
          ))}
        </div>
      )}

      {formOpen && (
        <HabitForm
          habit={editingHabit}
          onSubmit={handleSubmit}
          onClose={handleClose}
        />
      )}
    </div>
  );
}
