// lib/memory.ts
import { MemoryType, CreateMemoryInput } from '@/types'

export function computeImportance(input: CreateMemoryInput): number {
  let score = input.importance ?? 0.5

  // Type-based base scores
  const typeScores: Record<MemoryType, number> = {
    GOAL: 0.9,
    RELATIONSHIP: 0.8,
    EVENT: 0.7,
    FACT: 0.6,
    PREFERENCE: 0.6,
    SKILL: 0.7,
    CONTEXT: 0.4,
  }
  score = Math.max(score, typeScores[input.type] * 0.5 + score * 0.5)

  // Boost if has metadata
  if (input.metadata && Object.keys(input.metadata).length > 0) {
    score = Math.min(1, score + 0.05)
  }

  // Boost if has tags
  if (input.tags && input.tags.length > 0) {
    score = Math.min(1, score + 0.02 * input.tags.length)
  }

  return Math.round(score * 100) / 100
}

export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0
  let dot = 0, normA = 0, normB = 0
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }
  if (normA === 0 || normB === 0) return 0
  return dot / (Math.sqrt(normA) * Math.sqrt(normB))
}

// Simple text-based similarity using keyword overlap (fallback when no embeddings)
export function textSimilarity(query: string, content: string): number {
  const qWords = new Set(query.toLowerCase().split(/\s+/).filter(w => w.length > 2))
  const cWords = new Set(content.toLowerCase().split(/\s+/).filter(w => w.length > 2))
  if (qWords.size === 0) return 0
  let overlap = 0
  qWords.forEach(w => { if (cWords.has(w)) overlap++ })
  return overlap / qWords.size
}

export function shouldExpire(expiresAt: Date | null): boolean {
  if (!expiresAt) return false
  return new Date() > expiresAt
}

export function getMemoryColor(type: MemoryType): string {
  const colors: Record<MemoryType, string> = {
    FACT: '#6366f1',
    EVENT: '#22d3ee',
    PREFERENCE: '#a855f7',
    RELATIONSHIP: '#f59e0b',
    CONTEXT: '#64748b',
    SKILL: '#10b981',
    GOAL: '#ef4444',
  }
  return colors[type]
}

export function formatImportance(score: number): string {
  if (score >= 0.8) return 'Critical'
  if (score >= 0.6) return 'High'
  if (score >= 0.4) return 'Medium'
  return 'Low'
}
