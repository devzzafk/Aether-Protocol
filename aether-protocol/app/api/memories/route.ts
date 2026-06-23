// app/api/memories/route.ts
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api'
import { computeImportance, textSimilarity } from '@/lib/memory'
import { z } from 'zod'

const CreateSchema = z.object({
  type: z.enum(['FACT', 'EVENT', 'PREFERENCE', 'RELATIONSHIP', 'CONTEXT', 'SKILL', 'GOAL']),
  content: z.string().min(1).max(10000),
  metadata: z.record(z.unknown()).optional(),
  importance: z.number().min(0).max(1).optional(),
  confidence: z.number().min(0).max(1).optional(),
  expiresAt: z.string().optional(),
  namespace: z.string().optional().default('global'),
  tags: z.array(z.string()).optional().default([]),
  agentId: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query')
    const namespace = searchParams.get('namespace')
    const type = searchParams.get('type')
    const agentId = searchParams.get('agentId')
    const limit = parseInt(searchParams.get('limit') || '50')
    const page = parseInt(searchParams.get('page') || '1')
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}
    if (namespace) where.namespace = namespace
    if (type) where.type = type
    if (agentId) where.agentId = agentId

    // Filter out expired memories
    where.OR = [{ expiresAt: null }, { expiresAt: { gt: new Date() } }]

    const [memories, total] = await Promise.all([
      prisma.memory.findMany({
        where,
        include: { agent: { select: { id: true, name: true } } },
        orderBy: [{ importance: 'desc' }, { createdAt: 'desc' }],
        take: limit,
        skip,
      }),
      prisma.memory.count({ where })
    ])

    // Update access count and last accessed
    if (memories.length > 0) {
      await prisma.memory.updateMany({
        where: { id: { in: memories.map(m => m.id) } },
        data: { accessCount: { increment: 1 }, lastAccessed: new Date() }
      })
    }

    // Text-based search filtering
    let results = memories
    if (query) {
      results = memories
        .map(m => ({ ...m, score: textSimilarity(query, m.content) }))
        .filter(m => m.score > 0)
        .sort((a, b) => b.score - a.score)
    }

    return successResponse({
      memories: results,
      total,
      page,
      pages: Math.ceil(total / limit)
    })
  } catch (err) {
    console.error(err)
    return errorResponse('Failed to fetch memories', 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = CreateSchema.safeParse(body)
    if (!parsed.success) {
      return errorResponse(parsed.error.message)
    }

    const data = parsed.data
    const importance = computeImportance(data)

    const memory = await prisma.memory.create({
      data: {
        type: data.type,
        content: data.content,
        metadata: data.metadata,
        importance,
        confidence: data.confidence ?? 1.0,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        namespace: data.namespace,
        tags: data.tags,
        agentId: data.agentId,
      },
      include: { agent: { select: { id: true, name: true } } }
    })

    // Log sync
    if (data.agentId) {
      await prisma.syncLog.create({
        data: {
          agentId: data.agentId,
          action: 'MEMORY_CREATED',
          memoryId: memory.id,
          payload: { type: data.type, namespace: data.namespace },
          status: 'success'
        }
      })
    }

    return successResponse(memory, 201)
  } catch (err) {
    console.error(err)
    return errorResponse('Failed to create memory', 500)
  }
}
