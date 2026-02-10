import { Archive, Pencil, Trash2 } from 'lucide-react';
import type { Habit } from '../../types';
import { DAYS_OF_WEEK } from '../../lib/constants';

interface HabitCardProps {
  habit: Habit;
  onEdit: (habit: Habit) => void;
  onArchive: (id: number) => void;
  onDelete: (id: number) => void;
}

export function HabitCard({ habit, onEdit, onArchive, onDelete }: HabitCardProps) {
  const frequencyLabel =
    habit.frequencyType === 'daily'
      ? 'Every day'
      : habit.frequencyType === 'weekly'
        ? `${habit.targetPerWeek}x per week`
        : habit.frequencyDays?.map(d => DAYS_OF_WEEK[d]).join(', ') ?? 'Custom';

  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: habit.color ?? '#6366f1' }} />
        <div>
          <h3 className={`font-medium ${habit.isArchived ? 'line-through text-gray-400' : ''}`}>
            {habit.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{frequencyLabel}</p>
          {habit.description && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{habit.description}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onEdit(habit)}
          className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
        >
          <Pencil size={16} />
        </button>
        <button
          onClick={() => onArchive(habit.id)}
          className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
        >
          <Archive size={16} />
        </button>
        <button
          onClick={() => { if (confirm('Delete this habit and all its data?')) onDelete(habit.id); }}
          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
