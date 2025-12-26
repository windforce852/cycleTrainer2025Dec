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
  const targetDurationRef = useRef<number>(0)
  const pausedElapsedRef = useRef<number>(0)

  useEffect(() => {
    if (state === 'idle' || state === 'finished') {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    intervalRef.current = window.setInterval(() => {
      if (startTimeRef.current !== null && !isPaused) {
        const now = Date.now()
        const elapsed = pausedElapsedRef.current + (now - startTimeRef.current) / 1000
        const remaining = Math.max(0, targetDurationRef.current - elapsed)

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
  }, [state, isPaused])

  const handleStateTransition = () => {
    if (isPaused) return

    if (state === 'buffer') {
      // Buffer finished, start first cycle
      setState('cycle')
      setCurrentRound(1)
      targetDurationRef.current = config.cycleDuration
      setRemainingTime(config.cycleDuration)
      pausedElapsedRef.current = 0
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
        targetDurationRef.current = config.restTime
        setRemainingTime(config.restTime)
        pausedElapsedRef.current = 0
        setTextColor('text-blue-600')
      } else {
        // No rest time, go directly to next cycle
        const nextRound = currentRound + 1
        if (
          config.numberOfCycles === 'unlimited' ||
          nextRound <= config.numberOfCycles
        ) {
          setCurrentRound(nextRound)
          targetDurationRef.current = config.cycleDuration
          setRemainingTime(config.cycleDuration)
          pausedElapsedRef.current = 0
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
        targetDurationRef.current = config.cycleDuration
        setRemainingTime(config.cycleDuration)
        pausedElapsedRef.current = 0
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
    totalStartTimeRef.current = Date.now()
    pausedElapsedRef.current = 0
    
    if (config.bufferTime > 0) {
      setState('buffer')
      targetDurationRef.current = config.bufferTime
      setRemainingTime(config.bufferTime)
      setTextColor('text-yellow-600')
    } else {
      setState('cycle')
      setCurrentRound(1)
      targetDurationRef.current = config.cycleDuration
      setRemainingTime(config.cycleDuration)
      setTextColor('text-green-600')
      cyclesRef.current.push({
        cycleNumber: 1,
        duration: config.cycleDuration,
        startTime: Date.now(),
      })
    }
    startTimeRef.current = Date.now()
  }

  const pauseTraining = () => {
    if (state !== 'idle' && state !== 'finished' && !isPaused) {
      if (startTimeRef.current !== null) {
        pausedElapsedRef.current += (Date.now() - startTimeRef.current) / 1000
        startTimeRef.current = null
      }
      setIsPaused(true)
    }
  }

  const resumeTraining = () => {
    if (isPaused) {
      startTimeRef.current = Date.now()
      setIsPaused(false)
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

  const getRoundDisplay = (): string => {
    if (config.numberOfCycles === 'unlimited') {
      return `Round ${currentRound}`
    }
    return `Round ${currentRound}/${config.numberOfCycles}`
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">Mode 1: Timed Cycles</h2>
        <p className={`text-lg font-semibold ${textColor} transition-colors duration-300`}>
          {getStateLabel()}
        </p>
        {state !== 'idle' && state !== 'finished' && (
          <p className="text-gray-600 mt-2">{getRoundDisplay()}</p>
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

