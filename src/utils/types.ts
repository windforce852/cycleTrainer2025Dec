export type TrainingMode = 'mode1' | 'mode2'

export interface Mode1Config {
  cycleDuration: number // in seconds
  restTime: number // in seconds
  numberOfCycles: number | 'unlimited'
  bufferTime: number // in seconds
}

export interface Mode2Config {
  // No configuration needed for Mode 2
}

export interface CycleRecord {
  cycleNumber: number
  startTime: number // timestamp
  endTime?: number // timestamp
  duration?: number // in seconds
}

export interface TrainingSession {
  id: string
  mode: TrainingMode
  config: Mode1Config | Mode2Config
  startTime: number // timestamp
  endTime?: number // timestamp
  totalDuration?: number // in seconds
  cycles: CycleRecord[]
  totalRounds: number
}

export type TimerState = 'idle' | 'running' | 'paused' | 'finished'

export type Mode1TrainingState =
  | 'idle'
  | 'buffer'
  | 'cycle'
  | 'rest'
  | 'finished'

export type Mode2TrainingState = 'idle' | 'running' | 'paused' | 'finished'

export type ButtonState = 'start' | 'endRound' | 'stop' | 'resume' | 'finish'

export interface Mode2ButtonStates {
  showStart: boolean
  showEndRound: boolean
  showStop: boolean
  showResume: boolean
  showFinish: boolean
  endRoundDisabled: boolean
}

