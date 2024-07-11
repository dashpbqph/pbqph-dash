import { RouterOutputs } from '@/server/api/root'

// ITA
export type ITA = Awaited<RouterOutputs['ita']['getAll'][number]>

// FAD
export type FAD = Awaited<RouterOutputs['fad']['getAll'][number]>

// Guidelines
export type Guideline = Awaited<RouterOutputs['guideline']['getAll'][number]>

// DATEC
export type DATEC = Awaited<RouterOutputs['datec']['getAll'][number]>
