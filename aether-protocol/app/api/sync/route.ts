// app/api/sync/route.ts
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, getApiKey, validateAgent } from '@/lib/api'
import { computeImportance } from '@/lib/memory'
import { z } from 'zod'

const SyncSchema = z.object({
  memories: z.array(z.object({
    type: z.enum(['FACT', 'EVENT', 'PREFERENCE', 'RELATIONSHIP', 'CONTEXT', 'SKILL', 'GOAL']),
    content: z.string().min(1),
    metadata: z.record(z.unknown()).optional(),
    importance: z.number().min(0).max(1).optional(),
    confidence: z.number().min(0).max(1).optional(),
    expiresAt: z.string().optional(),
    namespace: z.string().optional().default('global'),
    tags: z.array(z.string()).optional().default([]),
  }))
})

// POST /api/sync — bulk push memories from an agent
export async function POST(request: NextRequest) {
  try {
    const apiKey = getApiKey(request)
    if (!apiKey) return errorResponse('Missing API key', 401)

    const agent = await validateAgent(apiKey)
    if (!agent) return errorResponse('Invalid API key', 401)

    const body = await request.json()
    const parsed = SyncSchema.safeParse(body)
    if (!parsed.success) return errorResponse(parsed.error.message)

    const { memories } = parsed.data

    const created = await prisma.$transaction(
      memories.map(m =>
        prisma.memory.create({
          data: {
            type: m.type,
            content: m.content,
            metadata: m.metadata,
            importance: computeImportance(m),
            confidence: m.confidence ?? 1.0,
            expiresAt: m.expiresAt ? new Date(m.expiresAt) : null,
            namespace: m.namespace,
            tags: m.tags,
            agentId: agent.id,
          }
        })
      )
    )

    await prisma.syncLog.create({
      data: {
        agentId: agent.id,
        action: 'BULK_SYNC',
        payload: { count: created.length },
        status: 'success'
      }
    })

    return successResponse({ synced: created.length, agent: agent.name })
  } catch (err) {
    console.error(err)
    return errorResponse('Sync failed', 500)
  }
}

// GET /api/sync — pull memories for an agent
export async function GET(request: NextRequest) {
  try {
    const apiKey = getApiKey(request)
    if (!apiKey) return errorResponse('Missing API key', 401)

    const agent = await validateAgent(apiKey)
    if (!agent) return errorResponse('Invalid API key', 401)

    const { searchParams } = new URL(request.url)
    const namespace = searchParams.get('namespace')
    const since = searchParams.get('since')

    const where: Record<string, unknown> = {
      OR: [{ agentId: agent.id }, { namespace: 'global' }]
    }
    if (namespace) where.namespace = namespace
    if (since) where.updatedAt = { gt: new Date(since) }
    where.AND = [{ OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] }]

    const memories = await prisma.memory.findMany({
      where,
      orderBy: [{ importance: 'desc' }, { updatedAt: 'desc' }],
      take: 500
    })

    await prisma.syncLog.create({
      data: {
        agentId: agent.id,
        action: 'PULL_SYNC',
        payload: { count: memories.length, namespace },
        status: 'success'
      }
    })

    return successResponse({ memories, agent: agent.name, timestamp: new Date().toISOString() })
  } catch {
    return errorResponse('Pull failed', 500)
  }
}
