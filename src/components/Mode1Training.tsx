import React, { useState, useEffect, useRef } from 'react'
import { Button } from './Button'
import { TimerDisplay } from './TimerDisplay'
import type { Mode1Config as Mode1ConfigType, Mode1TrainingState } from '../utils/types'

interface Mode1TrainingProps {
  config: Mode1ConfigType
  onFinish: (sessionData: {
    totalRounds: number
    totalDuration: number
    cycles: Array<{ cycleNumber: number; duration: number }>
  }) => void
  onCancel?: () => void
}

export const Mode1Training: React.FC<Mode1TrainingProps> = ({
  config,
  onFinish,
  onCancel,
}) => {
  const [state, setState] = useState<Mode1TrainingState>('idle')
  const [currentRound, setCurrentRound] = useState(0)
  const [remainingTime, setRemainingTime] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [textColor, setTextColor] = useState('text-gray-800')
  const startTimeRef = useRef<number | null>(null)
  const totalStartTimeRef = useRef<number | null>(null)
  const intervalRef = useRef<number | null>(null)
  const cyclesRef = useRef<Array<{ cycleNumber: number; duration: number; startTime: number }>>([])

  useEffect(() => {
    if (state === 'idle' || isPaused) {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    intervalRef.current = window.setInterval(() => {
      if (startTimeRef.current !== null && !isPaused) {
        const elapsed = (Date.now() - startTimeRef.current) / 1000
        const remaining = Math.max(0, remainingTime - elapsed)

        setRemainingTime(remaining)

        if (remaining <= 0) {
          handleStateTransition()
        }
      }
    }, 100)

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current)
      }
    }
  }, [state, isPaused, remainingTime])

  const handleStateTransition = () => {
    if (isPaused) return

    if (state === 'buffer') {
      // Buffer finished, start first cycle
      setState('cycle')
      setCurrentRound(1)
      setRemainingTime(config.cycleDuration)
      startTimeRef.current = Date.now()
      setTextColor('text-green-600')
      const cycleStartTime = Date.now()
      cyclesRef.current.push({
        cycleNumber: 1,
        duration: config.cycleDuration,
        startTime: cycleStartTime,
      })
    } else if (state === 'cycle') {
      // Cycle finished, start rest or next cycle
      const cycleIndex = cyclesRef.current.length - 1
      if (cycleIndex >= 0) {
        cyclesRef.current[cycleIndex].duration = config.cycleDuration
      }

      if (config.restTime > 0) {
        setState('rest')
        setRemainingTime(config.restTime)
        setTextColor('text-blue-600')
      } else {
        // No rest time, go directly to next cycle
        const nextRound = currentRound + 1
        if (
          config.numberOfCycles === 'unlimited' ||
          nextRound <= config.numberOfCycles
        ) {
          setCurrentRound(nextRound)
          setRemainingTime(config.cycleDuration)
          setTextColor('text-green-600')
          cyclesRef.current.push({
            cycleNumber: nextRound,
            duration: config.cycleDuration,
            startTime: Date.now(),
          })
        } else {
          finishTraining()
          return
        }
      }
      startTimeRef.current = Date.now()
    } else if (state === 'rest') {
      // Rest finished, start next cycle
      const nextRound = currentRound + 1
      if (
        config.numberOfCycles === 'unlimited' ||
        nextRound <= config.numberOfCycles
      ) {
        setState('cycle')
        setCurrentRound(nextRound)
        setRemainingTime(config.cycleDuration)
        setTextColor('text-green-600')
        startTimeRef.current = Date.now()
        cyclesRef.current.push({
          cycleNumber: nextRound,
          duration: config.cycleDuration,
          startTime: Date.now(),
        })
      } else {
        finishTraining()
        return
      }
    }
  }

  const startTraining = () => {
    if (config.bufferTime > 0) {
      setState('buffer')
      setRemainingTime(config.bufferTime)
      setTextColor('text-yellow-600')
    } else {
      setState('cycle')
      setCurrentRound(1)
      setRemainingTime(config.cycleDuration)
      setTextColor('text-green-600')
      cyclesRef.current.push({
        cycleNumber: 1,
        duration: config.cycleDuration,
        startTime: Date.now(),
      })
    }
    totalStartTimeRef.current = Date.now()
    startTimeRef.current = Date.now()
  }

  const pauseTraining = () => {
    if (state !== 'idle' && state !== 'finished') {
      setIsPaused(true)
    }
  }

  const resumeTraining = () => {
    if (isPaused) {
      setIsPaused(false)
      startTimeRef.current = Date.now() - (config.cycleDuration - remainingTime) * 1000
    }
  }

  const finishTraining = () => {
    setState('finished')
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    const totalDuration =
      totalStartTimeRef.current !== null
        ? (Date.now() - totalStartTimeRef.current) / 1000
        : 0

    onFinish({
      totalRounds: currentRound,
      totalDuration,
      cycles: cyclesRef.current.map((c) => ({
        cycleNumber: c.cycleNumber,
        duration: c.duration,
      })),
    })
  }

  const getStateLabel = (): string => {
    if (state === 'buffer') return 'Starting in...'
    if (state === 'cycle') return 'Cycle'
    if (state === 'rest') return 'Rest'
    if (state === 'finished') return 'Finished'
    return 'Ready'
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">Mode 1: Timed Cycles</h2>
        <p className={`text-lg font-semibold ${textColor} transition-colors duration-300`}>
          {getStateLabel()}
        </p>
        {state !== 'idle' && state !== 'finished' && (
          <p className="text-gray-600 mt-2">Round {currentRound}</p>
        )}
      </div>

      <div className="flex justify-center mb-8">
        <TimerDisplay
          seconds={Math.ceil(remainingTime)}
          className={textColor}
          aria-label="Remaining time"
        />
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        {state === 'idle' && (
          <>
            <Button onClick={startTraining}>Start</Button>
            {onCancel && (
              <Button variant="secondary" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </>
        )}

        {(state === 'buffer' || state === 'cycle' || state === 'rest') && (
          <>
            {isPaused ? (
              <Button onClick={resumeTraining}>Resume</Button>
            ) : (
              <Button onClick={pauseTraining}>Pause</Button>
            )}
            <Button variant="secondary" onClick={finishTraining}>
              Finish
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

