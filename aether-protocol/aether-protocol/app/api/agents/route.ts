// app/api/agents/route.ts
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api'
import { z } from 'zod'

const CreateSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
})

export async function GET() {
  try {
    const agents = await prisma.agent.findMany({
      include: { _count: { select: { memories: true } } },
      orderBy: { createdAt: 'desc' }
    })
    return successResponse(agents)
  } catch {
    return errorResponse('Failed to fetch agents', 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = CreateSchema.safeParse(body)
    if (!parsed.success) return errorResponse(parsed.error.message)

    const agent = await prisma.agent.create({
      data: parsed.data,
      include: { _count: { select: { memories: true } } }
    })
    return successResponse(agent, 201)
  } catch {
    return errorResponse('Failed to create agent', 500)
  }
}
