import React from 'react'
import { Button } from './Button'

interface Mode1ResultsProps {
  totalRounds: number
  cycleDuration: number
  totalDuration: number
  onNewTraining: () => void
  onViewSessions?: () => void
  onExportJSON?: () => void
  onExportCSV?: () => void
}

export const Mode1Results: React.FC<Mode1ResultsProps> = ({
  totalRounds,
  cycleDuration,
  totalDuration,
  onNewTraining,
  onViewSessions,
  onExportJSON,
  onExportCSV,
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}m ${secs}s`
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        Training Complete!
      </h2>

      <div className="space-y-4 mb-8">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Total Rounds Completed</p>
          <p className="text-3xl font-bold text-gray-800">{totalRounds}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Cycle Duration</p>
          <p className="text-3xl font-bold text-gray-800">{formatTime(cycleDuration)}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Total Training Time</p>
          <p className="text-3xl font-bold text-gray-800">{formatTime(totalDuration)}</p>
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

