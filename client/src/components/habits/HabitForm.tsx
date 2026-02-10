import { useState } from 'react';
import { X } from 'lucide-react';
import type { Habit } from '../../types';
import { HABIT_COLORS, DAYS_OF_WEEK } from '../../lib/constants';

interface HabitFormProps {
  habit?: Habit;
  onSubmit: (data: {
    name: string;
    description?: string;
    color?: string;
    frequencyType?: string;
    frequencyDays?: number[];
    targetPerWeek?: number;
  }) => void;
  onClose: () => void;
}

export function HabitForm({ habit, onSubmit, onClose }: HabitFormProps) {
  const [name, setName] = useState(habit?.name ?? '');
  const [description, setDescription] = useState(habit?.description ?? '');
  const [color, setColor] = useState(habit?.color ?? HABIT_COLORS[0]);
  const [frequencyType, setFrequencyType] = useState(habit?.frequencyType ?? 'daily');
  const [frequencyDays, setFrequencyDays] = useState<number[]>(habit?.frequencyDays ?? []);
  const [targetPerWeek, setTargetPerWeek] = useState(habit?.targetPerWeek ?? 3);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    onSubmit({
      name: name.trim(),
      description: description.trim() || undefined,
      color,
      frequencyType,
      frequencyDays: frequencyType === 'custom' ? frequencyDays : undefined,
      targetPerWeek: frequencyType === 'weekly' ? targetPerWeek : undefined,
    });
  }

  function toggleDay(day: number) {
    setFrequencyDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold">{habit ? 'Edit Habit' : 'New Habit'}</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Meditate"
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description (optional)</label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="e.g. 10 minutes of mindfulness"
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Color</label>
            <div className="flex gap-2">
              {HABIT_COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full border-2 transition-transform ${
                    color === c ? 'border-gray-900 dark:border-white scale-110' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Frequency</label>
            <select
              value={frequencyType}
              onChange={e => setFrequencyType(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="daily">Every day</option>
              <option value="weekly">X times per week</option>
              <option value="custom">Specific days</option>
            </select>
          </div>

          {frequencyType === 'weekly' && (
            <div>
              <label className="block text-sm font-medium mb-1">Times per week</label>
              <input
                type="number"
                min={1}
                max={7}
                value={targetPerWeek}
                onChange={e => setTargetPerWeek(Number(e.target.value))}
                className="w-20 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}

          {frequencyType === 'custom' && (
            <div>
              <label className="block text-sm font-medium mb-1">Days</label>
              <div className="flex gap-1">
                {DAYS_OF_WEEK.map((day, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => toggleDay(i)}
                    className={`w-10 h-10 rounded-md text-sm font-medium transition-colors ${
                      frequencyDays.includes(i)
                        ? 'bg-indigo-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-indigo-500 text-white rounded-md font-medium hover:bg-indigo-600 transition-colors"
            >
              {habit ? 'Save' : 'Create'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
