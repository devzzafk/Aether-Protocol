// app/api/seed/route.ts
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api'

export async function POST() {
  try {
    // Create demo agents
    const [chatgpt, cursor, researcher] = await Promise.all([
      prisma.agent.create({ data: { name: 'ChatGPT Agent', description: 'OpenAI ChatGPT integration' } }),
      prisma.agent.create({ data: { name: 'Cursor Agent', description: 'Cursor coding assistant' } }),
      prisma.agent.create({ data: { name: 'Research Agent', description: 'Deep research assistant' } }),
    ])

    // Create demo memories
    const memories = await Promise.all([
      prisma.memory.create({ data: { type: 'FACT', content: 'User is interested in AI and machine learning', importance: 0.9, namespace: 'global', agentId: chatgpt.id, tags: ['ai', 'interests'] } }),
      prisma.memory.create({ data: { type: 'PREFERENCE', content: 'User prefers dark mode interfaces', importance: 0.7, namespace: 'global', agentId: chatgpt.id, tags: ['ui', 'preference'] } }),
      prisma.memory.create({ data: { type: 'EVENT', content: 'Started building Aether Protocol project', importance: 0.95, namespace: 'projects', agentId: chatgpt.id, tags: ['aether', 'project'] } }),
      prisma.memory.create({ data: { type: 'FACT', content: 'User works primarily with TypeScript and Next.js', importance: 0.8, namespace: 'technical', agentId: cursor.id, tags: ['typescript', 'nextjs', 'stack'] } }),
      prisma.memory.create({ data: { type: 'SKILL', content: 'User is proficient in React and modern frontend development', importance: 0.75, namespace: 'technical', agentId: cursor.id, tags: ['react', 'frontend'] } }),
      prisma.memory.create({ data: { type: 'CONTEXT', content: 'Current project uses Prisma ORM with PostgreSQL', importance: 0.6, namespace: 'projects', agentId: cursor.id, tags: ['prisma', 'postgres'] } }),
      prisma.memory.create({ data: { type: 'FACT', content: 'Vector databases alone are insufficient for universal AI memory', importance: 0.85, namespace: 'research', agentId: researcher.id, tags: ['research', 'memory', 'ai'] } }),
      prisma.memory.create({ data: { type: 'RELATIONSHIP', content: 'Aether Protocol is the memory OS for AI agents', importance: 0.9, namespace: 'global', agentId: researcher.id, tags: ['aether', 'protocol'] } }),
      prisma.memory.create({ data: { type: 'GOAL', content: 'Build universal memory layer for all AI systems', importance: 1.0, namespace: 'global', tags: ['goal', 'aether', 'vision'] } }),
    ])

    // Create demo relations
    await Promise.all([
      prisma.relation.create({ data: { fromId: memories[2].id, toId: memories[0].id, relation: 'motivated_by' } }),
      prisma.relation.create({ data: { fromId: memories[7].id, toId: memories[6].id, relation: 'supported_by' } }),
      prisma.relation.create({ data: { fromId: memories[8].id, toId: memories[2].id, relation: 'instantiated_by' } }),
      prisma.relation.create({ data: { fromId: memories[3].id, toId: memories[4].id, relation: 'used_with' } }),
    ])

    return successResponse({ message: 'Demo data seeded', agents: 3, memories: memories.length })
  } catch (err) {
    console.error(err)
    return errorResponse('Seed failed: ' + String(err), 500)
  }
}
