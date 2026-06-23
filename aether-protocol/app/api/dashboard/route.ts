// app/api/dashboard/route.ts
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api'

export async function GET() {
  try {
    const [
      totalMemories,
      totalAgents,
      totalRelations,
      memoriesByType,
      recentActivity,
      namespaceCounts
    ] = await Promise.all([
      prisma.memory.count(),
      prisma.agent.count(),
      prisma.relation.count(),
      prisma.memory.groupBy({ by: ['type'], _count: { type: true } }),
      prisma.syncLog.findMany({ orderBy: { createdAt: 'desc' }, take: 10 }),
      prisma.memory.groupBy({
        by: ['namespace'],
        _count: { namespace: true },
        orderBy: { _count: { namespace: 'desc' } },
        take: 10
      })
    ])

    const byType: Record<string, number> = {}
    memoriesByType.forEach(m => { byType[m.type] = m._count.type })

    const topNamespaces = namespaceCounts.map(n => ({
      namespace: n.namespace,
      count: n._count.namespace
    }))

    return successResponse({
      totalMemories,
      totalAgents,
      totalRelations,
      memoriesByType: byType,
      recentActivity,
      topNamespaces
    })
  } catch (err) {
    console.error(err)
    return errorResponse('Failed to fetch stats', 500)
  }
}
