import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useStatsOverview, useTrends } from '../hooks/useStats';
import { useHabits } from '../hooks/useHabits';
import { Flame, Target, TrendingUp, ListChecks } from 'lucide-react';

function StatCard({ icon: Icon, label, value, color }: { icon: typeof Flame; label: string; value: string | number; color: string }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
        <Icon size={16} className={color} />
        {label}
      </div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}

export function StatsPage() {
  const { data: overview, isLoading: overviewLoading } = useStatsOverview();
  const { data: trends = [], isLoading: trendsLoading } = useTrends();
  const { data: habits = [] } = useHabits();

  if (overviewLoading || trendsLoading) {
    return <div className="text-center py-12 text-gray-500">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Statistics</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={ListChecks} label="Total Habits" value={overview?.totalHabits ?? 0} color="text-indigo-500" />
        <StatCard icon={Target} label="Completion Rate" value={`${overview?.completionRate ?? 0}%`} color="text-green-500" />
        <StatCard icon={TrendingUp} label="Entries (30d)" value={overview?.totalEntries ?? 0} color="text-blue-500" />
        <StatCard icon={Flame} label="Done (30d)" value={overview?.doneCount ?? 0} color="text-orange-500" />
      </div>

      {trends.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <h2 className="text-lg font-semibold mb-4">Weekly Completion Rate</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={trends}>
              <XAxis
                dataKey="weekStart"
                tickFormatter={v => new Date(v).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                tick={{ fontSize: 12 }}
              />
              <YAxis domain={[0, 100]} tickFormatter={v => `${v}%`} tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value) => [`${value}%`, 'Rate']}
                labelFormatter={v => new Date(v).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}
              />
              <Line type="monotone" dataKey="rate" stroke="#6366f1" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {habits.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <h2 className="text-lg font-semibold mb-4">Habits Overview</h2>
          <div className="space-y-2">
            {habits.map(habit => (
              <HabitStatRow key={habit.id} habitId={habit.id} name={habit.name} color={habit.color ?? '#6366f1'} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function HabitStatRow({ habitId, name, color }: { habitId: number; name: string; color: string }) {
  const { data } = useStatsOverview(); // reuse overview for now; individual stats via useHabitStats if needed
  // For a richer view we'd use useHabitStats(habitId), but let's keep it simple
  return (
    <div className="flex items-center gap-3">
      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-sm font-medium flex-1">{name}</span>
    </div>
  );
}
