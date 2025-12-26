import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Button } from './Button'
import type { CycleRecord } from '../utils/types'

interface Mode2ResultsProps {
  cycles: CycleRecord[]
  totalDuration: number
  onNewTraining: () => void
  onViewSessions?: () => void
  onExportJSON?: () => void
  onExportCSV?: () => void
}

export const Mode2Results: React.FC<Mode2ResultsProps> = ({
  cycles,
  onNewTraining,
  onViewSessions,
  onExportJSON,
  onExportCSV,
}) => {

  const chartData = cycles
    .filter((c) => c.duration !== undefined)
    .map((cycle) => ({
      cycle: cycle.cycleNumber,
      duration: cycle.duration!,
    }))

  const statistics = React.useMemo(() => {
    const durations = cycles
      .map((c) => c.duration)
      .filter((d): d is number => d !== undefined)

    if (durations.length === 0) {
      return {
        total: 0,
        average: 0,
        min: 0,
        max: 0,
      }
    }

    return {
      total: durations.length,
      average: durations.reduce((a, b) => a + b, 0) / durations.length,
      min: Math.min(...durations),
      max: Math.max(...durations),
    }
  }, [cycles])

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        Training Complete!
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Total Cycles</p>
          <p className="text-2xl font-bold text-gray-800">{statistics.total}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Average Time</p>
          <p className="text-2xl font-bold text-gray-800">
            {statistics.average.toFixed(1)}s
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Min Time</p>
          <p className="text-2xl font-bold text-gray-800">
            {statistics.min.toFixed(1)}s
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Max Time</p>
          <p className="text-2xl font-bold text-gray-800">
            {statistics.max.toFixed(1)}s
          </p>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Cycle Duration Trend</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="cycle" label={{ value: 'Cycle Number', position: 'insideBottom', offset: -5 }} />
              <YAxis label={{ value: 'Duration (seconds)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="duration"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Duration (s)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Individual Cycle Durations</h3>
        <div className="h-96 w-full overflow-y-auto bg-gray-50 p-4 rounded-lg">
          <div className="space-y-2">
            {chartData.map((entry) => (
              <div key={entry.cycle} className="flex items-center gap-4">
                <div className="w-28 text-sm font-semibold text-gray-700">
                  Cycle {entry.cycle}:
                </div>
                <div className="w-16 text-sm font-semibold text-gray-700 text-right">
                  {entry.duration.toFixed(1)}s
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-8 relative">
                  <div
                    className="bg-blue-600 h-8 rounded-full"
                    style={{
                      width: `${
                        statistics.max > 0 ? (entry.duration / statistics.max) * 100 : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        <Button onClick={onNewTraining}>Home</Button>
        {onViewSessions && (
          <Button variant="secondary" onClick={onViewSessions}>
            View Sessions
          </Button>
        )}
        {onExportJSON && (
          <Button variant="secondary" onClick={onExportJSON}>
            Export JSON
          </Button>
        )}
        {onExportCSV && (
          <Button variant="secondary" onClick={onExportCSV}>
            Export CSV
          </Button>
        )}
      </div>
    </div>
  )
}

