import React, { useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from './Button'
import type { Mode1Config as Mode1ConfigType } from '../utils/types'

interface Mode1ConfigProps {
  onSubmit: (config: Mode1ConfigType) => void
  onCancel?: () => void
}

export const Mode1Config: React.FC<Mode1ConfigProps> = ({ onSubmit, onCancel }) => {
  const [cycleDuration, setCycleDuration] = useState(60)
  const [restTime, setRestTime] = useState(30)
  const [numberOfCycles, setNumberOfCycles] = useState<number | 'unlimited'>('unlimited')
  const [bufferTime, setBufferTime] = useState(5)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (cycleDuration <= 0) {
      newErrors.cycleDuration = 'Cycle duration must be greater than 0'
    }

    if (restTime < 0) {
      newErrors.restTime = 'Rest time cannot be negative'
    }

    if (numberOfCycles !== 'unlimited' && numberOfCycles <= 0) {
      newErrors.numberOfCycles = 'Number of cycles must be greater than 0'
    }

    if (bufferTime < 0) {
      newErrors.bufferTime = 'Buffer time cannot be negative'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onSubmit({
        cycleDuration,
        restTime,
        numberOfCycles,
        bufferTime,
      })
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Mode 1: Timed Cycles Configuration</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="cycleDuration" className="block text-sm font-medium text-gray-700 mb-1">
            Cycle Duration (seconds)
          </label>
          <input
            id="cycleDuration"
            type="number"
            min="1"
            value={cycleDuration}
            onChange={(e) => setCycleDuration(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-invalid={!!errors.cycleDuration}
            aria-describedby={errors.cycleDuration ? 'cycleDuration-error' : undefined}
          />
          {errors.cycleDuration && (
            <p id="cycleDuration-error" className="mt-1 text-sm text-red-600" role="alert">
              {errors.cycleDuration}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="restTime" className="block text-sm font-medium text-gray-700 mb-1">
            Rest Time (seconds)
          </label>
          <input
            id="restTime"
            type="number"
            min="0"
            value={restTime}
            onChange={(e) => setRestTime(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-invalid={!!errors.restTime}
            aria-describedby={errors.restTime ? 'restTime-error' : undefined}
          />
          {errors.restTime && (
            <p id="restTime-error" className="mt-1 text-sm text-red-600" role="alert">
              {errors.restTime}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="numberOfCycles" className="block text-sm font-medium text-gray-700 mb-1">
            Number of Cycles
          </label>
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                checked={numberOfCycles === 'unlimited'}
                onChange={() => setNumberOfCycles('unlimited')}
                className="mr-2"
              />
              <span>Unlimited</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                checked={numberOfCycles !== 'unlimited'}
                onChange={() => setNumberOfCycles(1)}
                className="mr-2"
              />
              <input
                id="numberOfCycles"
                type="number"
                min="1"
                value={numberOfCycles === 'unlimited' ? '' : numberOfCycles}
                onChange={(e) => {
                  const value = e.target.value
                  if (value === '') {
                    setNumberOfCycles(1)
                  } else {
                    const numValue = Number(value)
                    if (!isNaN(numValue)) {
                      setNumberOfCycles(numValue)
                    }
                  }
                }}
                disabled={numberOfCycles === 'unlimited'}
                className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                aria-invalid={!!errors.numberOfCycles}
                aria-describedby={errors.numberOfCycles ? 'numberOfCycles-error' : undefined}
              />
            </label>
          </div>
          {errors.numberOfCycles && (
            <p id="numberOfCycles-error" className="mt-1 text-sm text-red-600" role="alert">
              {errors.numberOfCycles}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="bufferTime" className="block text-sm font-medium text-gray-700 mb-1">
            Buffer Time (seconds)
          </label>
          <input
            id="bufferTime"
            type="number"
            min="0"
            value={bufferTime}
            onChange={(e) => setBufferTime(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-invalid={!!errors.bufferTime}
            aria-describedby={errors.bufferTime ? 'bufferTime-error' : undefined}
          />
          {errors.bufferTime && (
            <p id="bufferTime-error" className="mt-1 text-sm text-red-600" role="alert">
              {errors.bufferTime}
            </p>
          )}
        </div>

        <div className="flex space-x-4 pt-4">
          <Button type="submit" className="flex-1">
            Start Training
          </Button>
          {onCancel && (
            <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}

