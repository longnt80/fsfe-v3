import { useMemo } from 'react';
import { startOfYear, endOfYear, eachDayOfInterval, format, getDay, getWeek } from 'date-fns';
import type { HeatmapEntry } from '../../types';

interface CalendarHeatmapProps {
  data: HeatmapEntry[];
  year: number;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function getIntensity(completed: number, total: number): string {
  if (total === 0) return 'bg-gray-100 dark:bg-gray-800';
  const ratio = completed / total;
  if (ratio === 0) return 'bg-gray-100 dark:bg-gray-800';
  if (ratio < 0.25) return 'bg-green-200 dark:bg-green-900';
  if (ratio < 0.5) return 'bg-green-300 dark:bg-green-700';
  if (ratio < 0.75) return 'bg-green-400 dark:bg-green-600';
  return 'bg-green-500 dark:bg-green-500';
}

export function CalendarHeatmap({ data, year }: CalendarHeatmapProps) {
  const dataMap = useMemo(() => {
    const map = new Map<string, HeatmapEntry>();
    data.forEach(d => map.set(d.date, d));
    return map;
  }, [data]);

  const days = useMemo(() => {
    const start = startOfYear(new Date(year, 0, 1));
    const end = endOfYear(new Date(year, 0, 1));
    return eachDayOfInterval({ start, end });
  }, [year]);

  const weeks = useMemo(() => {
    const result: (Date | null)[][] = [];
    let currentWeek: (Date | null)[] = [];

    // Pad first week
    const firstDayOfWeek = getDay(days[0]);
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push(null);
    }

    days.forEach(day => {
      currentWeek.push(day);
      if (getDay(day) === 6) {
        result.push(currentWeek);
        currentWeek = [];
      }
    });

    if (currentWeek.length > 0) {
      result.push(currentWeek);
    }

    return result;
  }, [days]);

  return (
    <div className="overflow-x-auto">
      <div className="inline-block">
        {/* Month labels */}
        <div className="flex mb-1 ml-8">
          {MONTHS.map((month, i) => (
            <div key={i} className="text-xs text-gray-400 dark:text-gray-500" style={{ width: `${100/12}%`, minWidth: 40 }}>
              {month}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="flex gap-[3px]">
          {/* Day labels */}
          <div className="flex flex-col gap-[3px] mr-1">
            {['', 'Mon', '', 'Wed', '', 'Fri', ''].map((label, i) => (
              <div key={i} className="text-[10px] text-gray-400 dark:text-gray-500 h-[13px] leading-[13px]">
                {label}
              </div>
            ))}
          </div>

          {/* Weeks */}
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((day, di) => {
                if (!day) return <div key={di} className="w-[13px] h-[13px]" />;

                const dateStr = format(day, 'yyyy-MM-dd');
                const entry = dataMap.get(dateStr);
                const intensity = entry ? getIntensity(entry.completed, entry.total) : 'bg-gray-100 dark:bg-gray-800';

                return (
                  <div
                    key={di}
                    className={`w-[13px] h-[13px] rounded-sm ${intensity}`}
                    title={`${format(day, 'MMM d')}: ${entry ? `${entry.completed}/${entry.total}` : 'No data'}`}
                  />
                );
              })}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1 mt-3 justify-end text-xs text-gray-400 dark:text-gray-500">
          <span>Less</span>
          <div className="w-[13px] h-[13px] rounded-sm bg-gray-100 dark:bg-gray-800" />
          <div className="w-[13px] h-[13px] rounded-sm bg-green-200 dark:bg-green-900" />
          <div className="w-[13px] h-[13px] rounded-sm bg-green-300 dark:bg-green-700" />
          <div className="w-[13px] h-[13px] rounded-sm bg-green-400 dark:bg-green-600" />
          <div className="w-[13px] h-[13px] rounded-sm bg-green-500 dark:bg-green-500" />
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
