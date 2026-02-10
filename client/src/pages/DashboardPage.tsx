import { format, startOfDay } from 'date-fns';
import { Check, Minus, X, Flame } from 'lucide-react';
import { useHabits } from '../hooks/useHabits';
import { useEntries, useUpsertEntry } from '../hooks/useEntries';
import { useHabitStats } from '../hooks/useStats';
import type { Habit, HabitEntry } from '../types';

function StreakBadge({ habitId }: { habitId: number }) {
  const { data } = useHabitStats(habitId);
  if (!data || data.currentStreak === 0) return null;
  return (
    <span className="flex items-center gap-0.5 text-xs text-orange-500 font-medium">
      <Flame size={12} />
      {data.currentStreak}
    </span>
  );
}

function EntryToggle({ habit, entry, date }: { habit: Habit; entry?: HabitEntry; date: string }) {
  const upsertMutation = useUpsertEntry();
  const status = entry?.status;

  function toggle(newStatus: 'done' | 'skipped' | 'missed') {
    upsertMutation.mutate({ habitId: habit.id, date, status: newStatus });
  }

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => toggle('done')}
        className={`p-1.5 rounded-md transition-colors ${
          status === 'done'
            ? 'text-white'
            : 'text-gray-400 hover:text-green-500 hover:bg-gray-100 dark:hover:bg-gray-800'
        }`}
        style={status === 'done' ? { backgroundColor: habit.color ?? '#22c55e' } : undefined}
        title="Done"
      >
        <Check size={16} />
      </button>
      <button
        onClick={() => toggle('skipped')}
        className={`p-1.5 rounded-md transition-colors ${
          status === 'skipped'
            ? 'bg-yellow-500 text-white'
            : 'text-gray-400 hover:text-yellow-500 hover:bg-gray-100 dark:hover:bg-gray-800'
        }`}
        title="Skipped"
      >
        <Minus size={16} />
      </button>
      <button
        onClick={() => toggle('missed')}
        className={`p-1.5 rounded-md transition-colors ${
          status === 'missed'
            ? 'bg-red-500 text-white'
            : 'text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800'
        }`}
        title="Missed"
      >
        <X size={16} />
      </button>
    </div>
  );
}

export function DashboardPage() {
  const today = format(startOfDay(new Date()), 'yyyy-MM-dd');
  const { data: habits = [], isLoading: habitsLoading } = useHabits();
  const { data: entries = [], isLoading: entriesLoading } = useEntries(today, today);

  if (habitsLoading || entriesLoading) {
    return <div className="text-center py-12 text-gray-500">Loading...</div>;
  }

  const todayDayOfWeek = new Date().getDay();

  const todaysHabits = habits.filter(h => {
    if (h.frequencyType === 'daily') return true;
    if (h.frequencyType === 'custom' && h.frequencyDays) {
      return h.frequencyDays.includes(todayDayOfWeek);
    }
    return true; // weekly habits show every day
  });

  const done = todaysHabits.filter(h => entries.find(e => e.habitId === h.id)?.status === 'done');
  const remaining = todaysHabits.filter(h => !entries.find(e => e.habitId === h.id && e.status === 'done'));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Today</h1>
        <p className="text-gray-500 dark:text-gray-400">{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
        <div className="mt-2 text-sm text-gray-500">
          {done.length}/{todaysHabits.length} completed
        </div>
      </div>

      {todaysHabits.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No habits scheduled for today. Go to Habits to create some!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {remaining.map(habit => (
            <div
              key={habit.id}
              className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: habit.color ?? '#6366f1' }} />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{habit.name}</span>
                    <StreakBadge habitId={habit.id} />
                  </div>
                  {habit.description && (
                    <p className="text-xs text-gray-400 mt-0.5">{habit.description}</p>
                  )}
                </div>
              </div>
              <EntryToggle
                habit={habit}
                entry={entries.find(e => e.habitId === habit.id)}
                date={today}
              />
            </div>
          ))}

          {done.length > 0 && (
            <>
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 pt-4">Completed</h2>
              {done.map(habit => (
                <div
                  key={habit.id}
                  className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 opacity-60"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: habit.color ?? '#6366f1' }} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium line-through">{habit.name}</span>
                        <StreakBadge habitId={habit.id} />
                      </div>
                    </div>
                  </div>
                  <EntryToggle
                    habit={habit}
                    entry={entries.find(e => e.habitId === habit.id)}
                    date={today}
                  />
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
