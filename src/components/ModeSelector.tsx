import React from 'react'
import { Button } from './Button'

interface ModeSelectorProps {
  onSelectMode1: () => void
  onSelectMode2: () => void
  onViewSessions?: () => void
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  onSelectMode1,
  onSelectMode2,
  onViewSessions,
}) => {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Cycle Training Stopwatch
      </h1>

      <div className="space-y-6 mb-8">
        <div className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">Mode 1: Timed Cycles</h2>
          <p className="text-gray-600 mb-4">
            Set fixed cycle duration, rest time, and number of cycles. The app will automatically
            time each cycle and rest period.
          </p>
          <Button onClick={onSelectMode1} className="w-full">
            Start Mode 1
          </Button>
        </div>

        <div className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">Mode 2: Manual Cycles</h2>
          <p className="text-gray-600 mb-4">
            Manually end each cycle. The app will record how long each cycle takes and show
            statistics and charts at the end.
          </p>
          <Button onClick={onSelectMode2} className="w-full">
            Start Mode 2
          </Button>
        </div>
      </div>

      {onViewSessions && (
        <div className="text-center">
          <Button variant="secondary" onClick={onViewSessions}>
            View Past Sessions
          </Button>
        </div>
      )}
    </div>
  )
}

