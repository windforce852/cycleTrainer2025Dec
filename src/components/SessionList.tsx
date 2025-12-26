import React from 'react'
import { Button } from './Button'
import type { TrainingSession } from '../utils/types'

interface SessionListProps {
  sessions: TrainingSession[]
  onSelectSession: (session: TrainingSession) => void
  onDeleteSession: (id: string) => void
  onBack?: () => void
}

export const SessionList: React.FC<SessionListProps> = ({
  sessions,
  onSelectSession,
  onDeleteSession,
  onBack,
}) => {
  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString()
  }

  const formatDuration = (seconds?: number): string => {
    if (!seconds) return 'N/A'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}m ${secs}s`
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Training Sessions</h2>
        {onBack && (
          <Button variant="secondary" onClick={onBack}>
            Back
          </Button>
        )}
      </div>

      {sessions.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No training sessions yet.</p>
          <p className="mt-2">Start a new training session to see it here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions
            .sort((a, b) => b.startTime - a.startTime)
            .map((session) => (
              <div
                key={session.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          session.mode === 'mode1'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {session.mode === 'mode1' ? 'Mode 1' : 'Mode 2'}
                      </span>
                      <span className="text-sm text-gray-600">
                        {formatDate(session.startTime)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Rounds: </span>
                        <span className="font-semibold">{session.totalRounds}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Duration: </span>
                        <span className="font-semibold">{formatDuration(session.totalDuration)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Cycles: </span>
                        <span className="font-semibold">{session.cycles.length}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="secondary"
                      onClick={() => onSelectSession(session)}
                      className="min-w-[100px]"
                    >
                      View
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => onDeleteSession(session.id)}
                      className="min-w-[100px]"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}

