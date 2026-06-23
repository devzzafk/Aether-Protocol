// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding Aether Protocol...')

  const [chatgpt, cursor, researcher] = await Promise.all([
    prisma.agent.create({ data: { name: 'ChatGPT Agent', description: 'OpenAI ChatGPT integration' } }),
    prisma.agent.create({ data: { name: 'Cursor Agent', description: 'Cursor coding assistant' } }),
    prisma.agent.create({ data: { name: 'Research Agent', description: 'Deep research assistant' } }),
  ])

  const memories = await Promise.all([
    prisma.memory.create({ data: { type: 'FACT', content: 'User is interested in AI and machine learning', importance: 0.9, namespace: 'global', agentId: chatgpt.id, tags: ['ai', 'interests'] } }),
    prisma.memory.create({ data: { type: 'PREFERENCE', content: 'User prefers dark mode interfaces', importance: 0.7, namespace: 'global', agentId: chatgpt.id, tags: ['ui', 'preference'] } }),
    prisma.memory.create({ data: { type: 'EVENT', content: 'Started building Aether Protocol project', importance: 0.95, namespace: 'projects', agentId: chatgpt.id, tags: ['aether', 'project'] } }),
    prisma.memory.create({ data: { type: 'FACT', content: 'User works primarily with TypeScript and Next.js', importance: 0.8, namespace: 'technical', agentId: cursor.id, tags: ['typescript', 'nextjs'] } }),
    prisma.memory.create({ data: { type: 'SKILL', content: 'User is proficient in React and modern frontend development', importance: 0.75, namespace: 'technical', agentId: cursor.id, tags: ['react', 'frontend'] } }),
    prisma.memory.create({ data: { type: 'FACT', content: 'Vector databases alone are insufficient for universal AI memory', importance: 0.85, namespace: 'research', agentId: researcher.id, tags: ['research', 'memory'] } }),
    prisma.memory.create({ data: { type: 'GOAL', content: 'Build universal memory layer for all AI systems', importance: 1.0, namespace: 'global', tags: ['goal', 'aether'] } }),
  ])

  await Promise.all([
    prisma.relation.create({ data: { fromId: memories[2].id, toId: memories[0].id, relation: 'motivated_by' } }),
    prisma.relation.create({ data: { fromId: memories[6].id, toId: memories[2].id, relation: 'instantiated_by' } }),
    prisma.relation.create({ data: { fromId: memories[3].id, toId: memories[4].id, relation: 'used_with' } }),
  ])

  console.log(`✓ Created ${3} agents, ${memories.length} memories, 3 relations`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
