import React from 'react'

interface TimerDisplayProps {
  seconds: number
  className?: string
  'aria-label'?: string
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  seconds,
  className = '',
  'aria-label': ariaLabel,
}) => {
  const formatTime = (totalSeconds: number): string => {
    const mins = Math.floor(totalSeconds / 60)
    const secs = Math.floor(totalSeconds % 60)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div
      className={`text-6xl font-mono font-bold ${className}`}
      aria-label={ariaLabel}
      role="timer"
      aria-live="polite"
    >
      {formatTime(seconds)}
    </div>
  )
}

