import { RouterOutputs } from '@/server/api/root'

// EGT
export type EGT = Awaited<RouterOutputs['egt']['getAll'][number]>

// EM
export type EM = Awaited<RouterOutputs['em']['getAll'][number]>

// PSQ
export type PSQ = Awaited<RouterOutputs['psq']['getAll'][number]>
