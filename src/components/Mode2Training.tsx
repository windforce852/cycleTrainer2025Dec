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
  const [textColor, setTextColor] = useState('text-gray-800')
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
    setTextColor('text-green-600')
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
      setTextColor('text-green-600')
    }
  }

  const handleStop = () => {
    timer.pause()
    setIsStopped(true)
    setTextColor('text-red-600')
  }

  const handleResume = () => {
    timer.resume()
    setIsStopped(false)
    setTextColor('text-green-600')
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
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">Mode 2: Manual Cycles</h2>
        <p className={`text-lg font-semibold ${textColor} transition-colors duration-300`}>
          {currentRound === 0 ? 'Ready' : `Round ${currentRound}`}
        </p>
      </div>

      <div className="flex justify-center mb-8">
        <TimerDisplay
          seconds={Math.ceil(timer.elapsed)}
          className={textColor}
          aria-label="Current cycle time"
        />
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
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

      {cycles.length > 0 && (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm font-semibold text-gray-700 mb-2">Completed Cycles: {cycles.length}</p>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {cycles.map((cycle) => (
              <div key={cycle.cycleNumber} className="text-sm text-gray-600">
                Round {cycle.cycleNumber}: {cycle.duration?.toFixed(1)}s
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

