import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTimer } from './useTimer'

describe('useTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('initializes with zero elapsed time', () => {
    const { result } = renderHook(() => useTimer())
    expect(result.current.elapsed).toBe(0)
    expect(result.current.isRunning).toBe(false)
    expect(result.current.isPaused).toBe(false)
  })

  it('starts the timer', () => {
    const { result } = renderHook(() => useTimer())

    act(() => {
      result.current.start()
    })

    expect(result.current.isRunning).toBe(true)
    expect(result.current.isPaused).toBe(false)
  })

  it('increments elapsed time when running', () => {
    const { result } = renderHook(() => useTimer())

    act(() => {
      result.current.start()
    })

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(result.current.elapsed).toBeGreaterThan(0)
  })

  it('pauses the timer', () => {
    const { result } = renderHook(() => useTimer())

    act(() => {
      result.current.start()
    })

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    const elapsedBeforePause = result.current.elapsed

    act(() => {
      result.current.pause()
    })

    expect(result.current.isPaused).toBe(true)
    expect(result.current.isRunning).toBe(true)

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    // Elapsed time should not change when paused
    expect(result.current.elapsed).toBeCloseTo(elapsedBeforePause, 1)
  })

  it('resumes the timer after pause', () => {
    const { result } = renderHook(() => useTimer())

    act(() => {
      result.current.start()
    })

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    act(() => {
      result.current.pause()
    })

    const elapsedBeforeResume = result.current.elapsed

    act(() => {
      result.current.resume()
    })

    expect(result.current.isPaused).toBe(false)

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    // Elapsed time should continue from where it paused
    expect(result.current.elapsed).toBeGreaterThan(elapsedBeforeResume)
  })

  it('resets the timer', () => {
    const { result } = renderHook(() => useTimer())

    act(() => {
      result.current.start()
    })

    act(() => {
      vi.advanceTimersByTime(2000)
    })

    expect(result.current.elapsed).toBeGreaterThan(0)

    act(() => {
      result.current.reset()
    })

    expect(result.current.elapsed).toBe(0)
    expect(result.current.isRunning).toBe(false)
    expect(result.current.isPaused).toBe(false)
  })

  it('maintains elapsed time across pause/resume cycles', () => {
    const { result } = renderHook(() => useTimer())

    act(() => {
      result.current.start()
    })

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    act(() => {
      result.current.pause()
    })

    const elapsedAfterFirstPause = result.current.elapsed

    act(() => {
      result.current.resume()
    })

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    act(() => {
      result.current.pause()
    })

    // Total elapsed should be sum of both running periods
    expect(result.current.elapsed).toBeGreaterThan(elapsedAfterFirstPause)
  })
})

