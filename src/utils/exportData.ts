import type { TrainingSession } from './types'

export const exportToJSON = (session: TrainingSession): void => {
  const dataStr = JSON.stringify(session, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = `cycle-training-${session.id}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export const exportToCSV = (session: TrainingSession): void => {
  if (session.mode === 'mode2' && session.cycles.length > 0) {
    // Mode 2: Export cycle times
    const headers = ['Cycle Number', 'Duration (seconds)', 'Start Time', 'End Time']
    const rows = session.cycles.map((cycle) => [
      cycle.cycleNumber.toString(),
      cycle.duration?.toFixed(2) || '',
      new Date(cycle.startTime).toISOString(),
      cycle.endTime ? new Date(cycle.endTime).toISOString() : '',
    ])

    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n')
    const dataBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `cycle-training-${session.id}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } else if (session.mode === 'mode1') {
    // Mode 1: Export summary
    const headers = ['Total Rounds', 'Cycle Duration (seconds)', 'Total Duration (seconds)', 'Start Time', 'End Time']
    const config = session.config as { cycleDuration: number }
    const rows = [
      [
        session.totalRounds.toString(),
        config.cycleDuration.toString(),
        session.totalDuration?.toFixed(2) || '',
        new Date(session.startTime).toISOString(),
        session.endTime ? new Date(session.endTime).toISOString() : '',
      ],
    ]

    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n')
    const dataBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `cycle-training-${session.id}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
}

