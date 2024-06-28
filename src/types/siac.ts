import { RouterOutputs } from '@/server/api/root'

// Company
export type Company = Awaited<RouterOutputs['company']['getAll'][number]>

// Project
export type ProjectWithRelations = Awaited<RouterOutputs['project']['getAll'][number]>

// OAC
export type OAC = Awaited<RouterOutputs['oac']['getAll'][number]>
