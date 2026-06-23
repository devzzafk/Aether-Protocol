// types/index.ts
export type MemoryType = 'FACT' | 'EVENT' | 'PREFERENCE' | 'RELATIONSHIP' | 'CONTEXT' | 'SKILL' | 'GOAL'

export interface Memory {
  id: string
  agentId?: string | null
  type: MemoryType
  content: string
  metadata?: Record<string, unknown> | null
  importance: number
  confidence: number
  expiresAt?: string | null
  accessCount: number
  lastAccessed?: string | null
  namespace: string
  tags: string[]
  createdAt: string
  updatedAt: string
  agent?: Agent | null
}

export interface Agent {
  id: string
  name: string
  description?: string | null
  apiKey: string
  createdAt: string
  updatedAt: string
  _count?: { memories: number }
}

export interface Relation {
  id: string
  fromId: string
  toId: string
  relation: string
  agentId?: string | null
  weight: number
  createdAt: string
  from?: Memory
  to?: Memory
}

export interface SyncLog {
  id: string
  agentId: string
  action: string
  memoryId?: string | null
  payload?: Record<string, unknown> | null
  status: string
  createdAt: string
}

export interface CreateMemoryInput {
  type: MemoryType
  content: string
  metadata?: Record<string, unknown>
  importance?: number
  confidence?: number
  expiresAt?: string
  namespace?: string
  tags?: string[]
  agentId?: string
}

export interface SearchMemoryInput {
  query: string
  namespace?: string
  type?: MemoryType
  agentId?: string
  limit?: number
  minImportance?: number
}

export interface GraphNode {
  id: string
  label: string
  type: MemoryType
  importance: number
  x?: number
  y?: number
}

export interface GraphEdge {
  source: string
  target: string
  relation: string
  weight: number
}

export interface DashboardStats {
  totalMemories: number
  totalAgents: number
  totalRelations: number
  memoriesByType: Record<string, number>
  recentActivity: SyncLog[]
  topNamespaces: { namespace: string; count: number }[]
}
