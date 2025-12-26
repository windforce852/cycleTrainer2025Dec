import { useState, useEffect } from 'react'
import type { TrainingSession } from '../utils/types'

const STORAGE_KEY = 'cycle-training-sessions'

export const useLocalStorage = () => {
  const [sessions, setSessions] = useState<TrainingSession[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setSessions(JSON.parse(stored))
      }
    } catch (error) {
      console.error('Error loading sessions from localStorage:', error)
    }
  }, [])

  const saveSession = (session: TrainingSession): void => {
    try {
      const updatedSessions = [...sessions, session]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSessions))
      setSessions(updatedSessions)
    } catch (error) {
      console.error('Error saving session to localStorage:', error)
      throw new Error('Failed to save session')
    }
  }

  const getSession = (id: string): TrainingSession | undefined => {
    return sessions.find((s) => s.id === id)
  }

  const getAllSessions = (): TrainingSession[] => {
    return sessions
  }

  const deleteSession = (id: string): void => {
    try {
      const updatedSessions = sessions.filter((s) => s.id !== id)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSessions))
      setSessions(updatedSessions)
    } catch (error) {
      console.error('Error deleting session from localStorage:', error)
      throw new Error('Failed to delete session')
    }
  }

  const clearAllSessions = (): void => {
    try {
      localStorage.removeItem(STORAGE_KEY)
      setSessions([])
    } catch (error) {
      console.error('Error clearing sessions from localStorage:', error)
      throw new Error('Failed to clear sessions')
    }
  }

  return {
    sessions,
    saveSession,
    getSession,
    getAllSessions,
    deleteSession,
    clearAllSessions,
  }
}

