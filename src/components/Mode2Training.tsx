import React, { useState, useRef } from 'react'
import { Button } from './Button'
import { TimerDisplay } from './TimerDisplay'
import { useTimer } from '../hooks/useTimer'
import type { Mode2ButtonStates, CycleRecord } from '../utils/types'

interface Mode2TrainingProps {
  onFinish: (sessionData: {
    cycles: CycleRecord[]
    totalDuration: number
  }) => void
  onCancel?: () => void
}

export const Mode2Training: React.FC<Mode2TrainingProps> = ({ onFinish, onCancel }) => {
  const [currentRound, setCurrentRound] = useState(0)
  const [isStopped, setIsStopped] = useState(false)
  const [textColor, setTextColor] = useState('text-black dark:text-white')
  const [cycles, setCycles] = useState<CycleRecord[]>([])
  const cycleStartTimeRef = useRef<number | null>(null)
  const totalStartTimeRef = useRef<number | null>(null)

  const timer = useTimer()

  const getButtonStates = (): Mode2ButtonStates => {
    if (currentRound === 0) {
      // Initial state
      return {
        showStart: true,
        showEndRound: false,
        showStop: false,
        showResume: false,
        showFinish: false,
        endRoundDisabled: false,
      }
    }

    if (isStopped) {
      // Stopped state
      return {
        showStart: false,
        showEndRound: true,
        showStop: false,
        showResume: true,
        showFinish: true,
        endRoundDisabled: true, // Critical: End Round is disabled when stopped
      }
    }

    // Running state
    return {
      showStart: false,
      showEndRound: true,
      showStop: true,
      showResume: false,
      showFinish: false,
      endRoundDisabled: false,
    }
  }

  const handleStart = () => {
    timer.start()
    totalStartTimeRef.current = Date.now()
    setCurrentRound(1)
    cycleStartTimeRef.current = Date.now()
    setTextColor('text-volt dark:text-volt')
    setIsStopped(false)
  }

  const handleEndRound = () => {
    if (cycleStartTimeRef.current !== null) {
      const endTime = Date.now()
      const duration = (endTime - cycleStartTimeRef.current) / 1000

      const newCycle: CycleRecord = {
        cycleNumber: currentRound,
        startTime: cycleStartTimeRef.current,
        endTime,
        duration,
      }

      setCycles([...cycles, newCycle])
      setCurrentRound(currentRound + 1)
      cycleStartTimeRef.current = Date.now()
      timer.restart() // Use restart instead of reset + start
      setTextColor('text-volt dark:text-volt')
    }
  }

  const handleStop = () => {
    timer.pause()
    setIsStopped(true)
    setTextColor('text-red-600 dark:text-red-500')
  }

  const handleResume = () => {
    timer.resume()
    setIsStopped(false)
    setTextColor('text-volt dark:text-volt')
  }

  const handleFinish = () => {
    let finalCycles = [...cycles]

    // Record the current cycle if it was started
    if (cycleStartTimeRef.current !== null && timer.isRunning) {
      const endTime = Date.now()
      const duration = (endTime - cycleStartTimeRef.current) / 1000

      const newCycle: CycleRecord = {
        cycleNumber: currentRound,
        startTime: cycleStartTimeRef.current,
        endTime,
        duration,
      }

      finalCycles = [...cycles, newCycle]
    }

    const totalDuration =
      totalStartTimeRef.current !== null
        ? (Date.now() - totalStartTimeRef.current) / 1000
        : 0

    onFinish({
      cycles: finalCycles,
      totalDuration,
    })
  }

  const buttonStates = getButtonStates()

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4 text-black dark:text-white transition-colors duration-300">
            Manual Cycles
          </h1>
          <p className={`text-2xl md:text-3xl font-black uppercase tracking-wide ${textColor} transition-colors duration-300`}>
            {currentRound === 0 ? 'Ready to Start' : `Round ${currentRound}`}
          </p>
        </div>

        {/* Timer Display */}
        <div className="flex justify-center mb-16">
          <TimerDisplay
            seconds={Math.ceil(timer.elapsed)}
            className={textColor}
            aria-label="Current cycle time"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mb-12">
          {buttonStates.showStart && (
            <>
              <Button onClick={handleStart}>Start</Button>
              {onCancel && (
                <Button variant="secondary" onClick={onCancel}>
                  Cancel
                </Button>
              )}
            </>
          )}

          {buttonStates.showEndRound && (
            <Button
              onClick={handleEndRound}
              disabled={buttonStates.endRoundDisabled}
              aria-label="End current round"
            >
              End Round
            </Button>
          )}

          {buttonStates.showStop && (
            <Button onClick={handleStop} variant="secondary" aria-label="Stop training">
              Stop
            </Button>
          )}

          {buttonStates.showResume && (
            <Button onClick={handleResume} aria-label="Resume training">
              Resume
            </Button>
          )}

          {buttonStates.showFinish && (
            <Button onClick={handleFinish} variant="secondary" aria-label="Finish training">
              Finish
            </Button>
          )}
        </div>

        {/* Completed Cycles List */}
        {cycles.length > 0 && (
          <div className="mt-16 border-t border-black/10 dark:border-white/10 pt-8 transition-colors duration-300">
            <h2 className="text-xl font-black uppercase tracking-wide mb-6 text-black dark:text-white transition-colors duration-300">
              Laps — {cycles.length}
            </h2>
            <div className="space-y-0 max-h-96 overflow-y-auto">
              {cycles.map((cycle) => (
                <div
                  key={cycle.cycleNumber}
                  className="flex justify-between items-center py-4 border-b border-black/10 dark:border-white/10 last:border-b-0 transition-colors duration-300"
                >
                  <span className="text-lg font-black uppercase text-black dark:text-white transition-colors duration-300">
                    Lap {cycle.cycleNumber}
                  </span>
                  <span className="text-2xl font-black tabular-nums text-black dark:text-white transition-colors duration-300">
                    {cycle.duration?.toFixed(1)}s
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

