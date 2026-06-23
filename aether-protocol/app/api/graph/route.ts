// app/api/graph/route.ts
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api'
import { z } from 'zod'

const RelationSchema = z.object({
  fromId: z.string(),
  toId: z.string(),
  relation: z.string().min(1).max(100),
  agentId: z.string().optional(),
  weight: z.number().min(0).max(1).optional().default(1.0),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const namespace = searchParams.get('namespace')
    const agentId = searchParams.get('agentId')

    const memoryWhere: Record<string, unknown> = {}
    if (namespace) memoryWhere.namespace = namespace
    if (agentId) memoryWhere.agentId = agentId

    const [memories, relations] = await Promise.all([
      prisma.memory.findMany({
        where: memoryWhere,
        select: { id: true, content: true, type: true, importance: true, namespace: true, agentId: true },
        take: 200
      }),
      prisma.relation.findMany({
        include: {
          from: { select: { id: true, content: true, type: true } },
          to: { select: { id: true, content: true, type: true } }
        },
        take: 500
      })
    ])

    const nodes = memories.map(m => ({
      id: m.id,
      label: m.content.length > 50 ? m.content.slice(0, 50) + '…' : m.content,
      type: m.type,
      importance: m.importance,
      namespace: m.namespace,
      agentId: m.agentId
    }))

    const memoryIds = new Set(memories.map(m => m.id))
    const edges = relations
      .filter(r => memoryIds.has(r.fromId) && memoryIds.has(r.toId))
      .map(r => ({
        source: r.fromId,
        target: r.toId,
        relation: r.relation,
        weight: r.weight
      }))

    return successResponse({ nodes, edges })
  } catch (err) {
    console.error(err)
    return errorResponse('Failed to fetch graph', 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = RelationSchema.safeParse(body)
    if (!parsed.success) return errorResponse(parsed.error.message)

    const relation = await prisma.relation.create({ data: parsed.data })
    return successResponse(relation, 201)
  } catch (err) {
    console.error(err)
    return errorResponse('Failed to create relation', 500)
  }
}
