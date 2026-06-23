// app/api/memories/[id]/route.ts
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api'
import { z } from 'zod'

const UpdateSchema = z.object({
  content: z.string().min(1).max(10000).optional(),
  metadata: z.record(z.unknown()).optional(),
  importance: z.number().min(0).max(1).optional(),
  confidence: z.number().min(0).max(1).optional(),
  expiresAt: z.string().nullable().optional(),
  tags: z.array(z.string()).optional(),
  namespace: z.string().optional(),
})

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const memory = await prisma.memory.findUnique({
      where: { id: params.id },
      include: {
        agent: { select: { id: true, name: true } },
        fromRelations: { include: { to: { select: { id: true, content: true, type: true } } } },
        toRelations: { include: { from: { select: { id: true, content: true, type: true } } } },
      }
    })
    if (!memory) return errorResponse('Memory not found', 404)
    await prisma.memory.update({
      where: { id: params.id },
      data: { accessCount: { increment: 1 }, lastAccessed: new Date() }
    })
    return successResponse(memory)
  } catch {
    return errorResponse('Failed to fetch memory', 500)
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const parsed = UpdateSchema.safeParse(body)
    if (!parsed.success) return errorResponse(parsed.error.message)

    const data = parsed.data
    const memory = await prisma.memory.update({
      where: { id: params.id },
      data: {
        ...data,
        expiresAt: data.expiresAt === null ? null : data.expiresAt ? new Date(data.expiresAt) : undefined,
      },
    })
    return successResponse(memory)
  } catch {
    return errorResponse('Failed to update memory', 500)
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.memory.delete({ where: { id: params.id } })
    return successResponse({ deleted: true })
  } catch {
    return errorResponse('Failed to delete memory', 500)
  }
}
