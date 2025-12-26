import { useState } from 'react'
import { ModeSelector } from './components/ModeSelector'
import { Mode1Config } from './components/Mode1Config'
import { Mode1Training } from './components/Mode1Training'
import { Mode1Results } from './components/Mode1Results'
import { Mode2Training } from './components/Mode2Training'
import { Mode2Results } from './components/Mode2Results'
import { SessionList } from './components/SessionList'
import { useLocalStorage } from './hooks/useLocalStorage'
import { exportToJSON, exportToCSV } from './utils/exportData'
import type {
  Mode1Config as Mode1ConfigType,
  TrainingSession,
  CycleRecord,
} from './utils/types'

type AppView =
  | 'mode-selector'
  | 'mode1-config'
  | 'mode1-training'
  | 'mode1-results'
  | 'mode2-training'
  | 'mode2-results'
  | 'session-list'
  | 'session-detail'

function App() {
  const [currentView, setCurrentView] = useState<AppView>('mode-selector')
  const [mode1Config, setMode1Config] = useState<Mode1ConfigType | null>(null)
  const [currentSession, setCurrentSession] = useState<TrainingSession | null>(null)
  const storage = useLocalStorage()

  const generateSessionId = (): string => {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  const handleMode1ConfigSubmit = (config: Mode1ConfigType) => {
    setMode1Config(config)
    setCurrentView('mode1-training')
  }

  const handleMode1Finish = (data: {
    totalRounds: number
    totalDuration: number
    cycles: Array<{ cycleNumber: number; duration: number }>
  }) => {
    if (!mode1Config) return

    const session: TrainingSession = {
      id: generateSessionId(),
      mode: 'mode1',
      config: mode1Config,
      startTime: Date.now() - data.totalDuration * 1000,
      endTime: Date.now(),
      totalDuration: data.totalDuration,
      cycles: data.cycles.map((c) => ({
        cycleNumber: c.cycleNumber,
        startTime: Date.now() - data.totalDuration * 1000,
        duration: c.duration,
      })),
      totalRounds: data.totalRounds,
    }

    storage.saveSession(session)
    setCurrentSession(session)
    setCurrentView('mode1-results')
  }

  const handleMode2Finish = (data: { cycles: CycleRecord[]; totalDuration: number }) => {
    const session: TrainingSession = {
      id: generateSessionId(),
      mode: 'mode2',
      config: {},
      startTime: Date.now() - data.totalDuration * 1000,
      endTime: Date.now(),
      totalDuration: data.totalDuration,
      cycles: data.cycles,
      totalRounds: data.cycles.length,
    }

    storage.saveSession(session)
    setCurrentSession(session)
    setCurrentView('mode2-results')
  }

  const handleExportJSON = () => {
    if (currentSession) {
      exportToJSON(currentSession)
    }
  }

  const handleExportCSV = () => {
    if (currentSession) {
      exportToCSV(currentSession)
    }
  }

  const handleViewSession = (session: TrainingSession) => {
    setCurrentSession(session)
    if (session.mode === 'mode1') {
      setCurrentView('mode1-results')
    } else {
      setCurrentView('mode2-results')
    }
  }

  const handleNewTraining = () => {
    setCurrentSession(null)
    setMode1Config(null)
    setCurrentView('mode-selector')
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      {currentView === 'mode-selector' && (
        <ModeSelector
          onSelectMode1={() => setCurrentView('mode1-config')}
          onSelectMode2={() => setCurrentView('mode2-training')}
          onViewSessions={() => setCurrentView('session-list')}
        />
      )}

      {currentView === 'mode1-config' && (
        <Mode1Config
          onSubmit={handleMode1ConfigSubmit}
          onCancel={() => setCurrentView('mode-selector')}
        />
      )}

      {currentView === 'mode1-training' && mode1Config && (
        <Mode1Training
          config={mode1Config}
          onFinish={handleMode1Finish}
          onCancel={() => setCurrentView('mode-selector')}
        />
      )}

      {currentView === 'mode1-results' && currentSession && currentSession.mode === 'mode1' && (
        <Mode1Results
          totalRounds={currentSession.totalRounds}
          cycleDuration={(currentSession.config as Mode1ConfigType).cycleDuration}
          totalDuration={currentSession.totalDuration || 0}
          onNewTraining={handleNewTraining}
          onViewSessions={() => setCurrentView('session-list')}
          onExportJSON={handleExportJSON}
          onExportCSV={handleExportCSV}
        />
      )}

      {currentView === 'mode2-training' && (
        <Mode2Training
          onFinish={handleMode2Finish}
          onCancel={() => setCurrentView('mode-selector')}
        />
      )}

      {currentView === 'mode2-results' && currentSession && currentSession.mode === 'mode2' && (
        <Mode2Results
          cycles={currentSession.cycles}
          totalDuration={currentSession.totalDuration || 0}
          onNewTraining={handleNewTraining}
          onViewSessions={() => setCurrentView('session-list')}
          onExportJSON={handleExportJSON}
          onExportCSV={handleExportCSV}
        />
      )}

      {currentView === 'session-list' && (
        <SessionList
          sessions={storage.getAllSessions()}
          onSelectSession={handleViewSession}
          onDeleteSession={(id) => storage.deleteSession(id)}
          onBack={() => setCurrentView('mode-selector')}
        />
      )}
    </div>
  )
}

export default App
