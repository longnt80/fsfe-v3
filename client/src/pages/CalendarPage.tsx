import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useHeatmap } from '../hooks/useStats';
import { CalendarHeatmap } from '../components/calendar/CalendarHeatmap';

export function CalendarPage() {
  const [year, setYear] = useState(new Date().getFullYear());
  const { data: heatmapData = [], isLoading } = useHeatmap(year);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Calendar</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setYear(y => y - 1)}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="font-medium">{year}</span>
          <button
            onClick={() => setYear(y => y + 1)}
            disabled={year >= new Date().getFullYear()}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded disabled:opacity-30"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : (
        <CalendarHeatmap data={heatmapData} year={year} />
      )}
    </div>
  );
}
