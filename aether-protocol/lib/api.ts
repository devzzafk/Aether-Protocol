// lib/api.ts
export function successResponse(data: unknown, status = 200) {
  return Response.json({ success: true, data }, { status })
}

export function errorResponse(message: string, status = 400) {
  return Response.json({ success: false, error: message }, { status })
}

export function getApiKey(request: Request): string | null {
  const auth = request.headers.get('Authorization')
  if (auth?.startsWith('Bearer ')) return auth.slice(7)
  const url = new URL(request.url)
  return url.searchParams.get('apiKey')
}

export async function validateAgent(apiKey: string) {
  const { prisma } = await import('./prisma')
  const agent = await prisma.agent.findUnique({ where: { apiKey } })
  return agent
}
