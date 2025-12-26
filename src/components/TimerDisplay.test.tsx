import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TimerDisplay } from './TimerDisplay'

describe('TimerDisplay', () => {
  it('formats seconds correctly as MM:SS', () => {
    render(<TimerDisplay seconds={125} />)
    expect(screen.getByText('02:05')).toBeInTheDocument()
  })

  it('handles zero seconds', () => {
    render(<TimerDisplay seconds={0} />)
    expect(screen.getByText('00:00')).toBeInTheDocument()
  })

  it('handles single digit minutes and seconds', () => {
    render(<TimerDisplay seconds={65} />)
    expect(screen.getByText('01:05')).toBeInTheDocument()
  })

  it('handles large values', () => {
    render(<TimerDisplay seconds={3661} />)
    expect(screen.getByText('61:01')).toBeInTheDocument()
  })

  it('rounds down fractional seconds', () => {
    render(<TimerDisplay seconds={125.7} />)
    expect(screen.getByText('02:05')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<TimerDisplay seconds={60} className="custom-class" />)
    const timer = screen.getByText('01:00')
    expect(timer.className).toContain('custom-class')
  })

  it('has proper ARIA attributes', () => {
    render(<TimerDisplay seconds={60} aria-label="Current time" />)
    const timer = screen.getByLabelText('Current time')
    expect(timer).toHaveAttribute('role', 'timer')
    expect(timer).toHaveAttribute('aria-live', 'polite')
  })
})

