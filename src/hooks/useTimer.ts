import { useState, useEffect, useRef } from 'react'

export interface UseTimerReturn {
  elapsed: number
  isRunning: boolean
  isPaused: boolean
  start: () => void
  pause: () => void
  resume: () => void
  reset: () => void
  restart: () => void
}

export const useTimer = (): UseTimerReturn => {
  const [elapsed, setElapsed] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const startTimeRef = useRef<number | null>(null)
  const pausedTimeRef = useRef<number>(0)
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = window.setInterval(() => {
        if (startTimeRef.current !== null) {
          const now = Date.now()
          const totalElapsed = pausedTimeRef.current + (now - startTimeRef.current) / 1000
          setElapsed(totalElapsed)
        }
      }, 100) // Update every 100ms for smooth display
    } else {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, isPaused])

  const start = () => {
    if (!isRunning) {
      startTimeRef.current = Date.now()
      setIsRunning(true)
      setIsPaused(false)
    }
  }

  const pause = () => {
    if (isRunning && !isPaused) {
      if (startTimeRef.current !== null) {
        pausedTimeRef.current += (Date.now() - startTimeRef.current) / 1000
        startTimeRef.current = null
      }
      setIsPaused(true)
    }
  }

  const resume = () => {
    if (isRunning && isPaused) {
      startTimeRef.current = Date.now()
      setIsPaused(false)
    }
  }

  const reset = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    startTimeRef.current = null
    pausedTimeRef.current = 0
    setElapsed(0)
    setIsRunning(false)
    setIsPaused(false)
  }

  const restart = () => {
    // Reset and start in one operation to avoid display flicker
    pausedTimeRef.current = 0
    setElapsed(0)
    startTimeRef.current = Date.now()
    if (!isRunning) {
      setIsRunning(true)
      setIsPaused(false)
    }
  }

  return {
    elapsed,
    isRunning,
    isPaused,
    start,
    pause,
    resume,
    reset,
    restart,
  }
}

