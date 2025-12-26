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
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-4xl">
        <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tight mb-16 text-center text-black dark:text-white transition-colors duration-300">
          Cycle Training
        </h1>

        <div className="space-y-6 mb-12">
          <div className="border-2 border-black/10 dark:border-white/10 rounded-xl p-8 hover:border-volt transition-all duration-300">
            <h2 className="text-2xl md:text-3xl font-black uppercase mb-3 text-black dark:text-white transition-colors duration-300">
              Mode 1: Timed Cycles
            </h2>
            <p className="text-base text-gray-700 dark:text-gray-300 mb-6 transition-colors duration-300">
              Set fixed cycle duration, rest time, and number of cycles. The app will automatically
              time each cycle and rest period.
            </p>
            <Button onClick={onSelectMode1} className="w-full">
              Start Mode 1
            </Button>
          </div>

          <div className="border-2 border-black/10 dark:border-white/10 rounded-xl p-8 hover:border-volt transition-all duration-300">
            <h2 className="text-2xl md:text-3xl font-black uppercase mb-3 text-black dark:text-white transition-colors duration-300">
              Mode 2: Manual Cycles
            </h2>
            <p className="text-base text-gray-700 dark:text-gray-300 mb-6 transition-colors duration-300">
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
    </div>
  )
}

