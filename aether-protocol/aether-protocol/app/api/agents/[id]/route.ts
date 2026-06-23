// app/api/agents/[id]/route.ts
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const agent = await prisma.agent.findUnique({
      where: { id: params.id },
      include: {
        _count: { select: { memories: true } },
        memories: { orderBy: { createdAt: 'desc' }, take: 10 }
      }
    })
    if (!agent) return errorResponse('Agent not found', 404)
    return successResponse(agent)
  } catch {
    return errorResponse('Failed to fetch agent', 500)
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.agent.delete({ where: { id: params.id } })
    return successResponse({ deleted: true })
  } catch {
    return errorResponse('Failed to delete agent', 500)
  }
}
