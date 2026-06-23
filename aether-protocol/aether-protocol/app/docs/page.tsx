'use client'
import Link from 'next/link'
import { BookOpen, Terminal, Zap, Brain, Shield, Globe } from 'lucide-react'

function Section({ id, title, children }: { id: string, title: string, children: React.ReactNode }) {
  return (
    <section id={id} className="space-y-4">
      <h2 className="font-display text-xl font-bold text-aether-text border-b border-aether-border pb-3">{title}</h2>
      {children}
    </section>
  )
}

function Code({ children }: { children: string }) {
  return (
    <pre className="bg-aether-deep border border-aether-border rounded-xl p-4 text-xs font-mono text-aether-dim overflow-x-auto">
      <code>{children}</code>
    </pre>
  )
}

function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="bg-aether-muted text-indigo-300 text-xs font-mono px-1.5 py-0.5 rounded">
      {children}
    </code>
  )
}

export default function DocsPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex gap-8">
        {/* Sidebar TOC */}
        <aside className="hidden lg:block w-48 flex-shrink-0">
          <div className="sticky top-24 space-y-1 text-sm">
            {[
              ['intro', 'Introduction'],
              ['quickstart', 'Quickstart'],
              ['memory-types', 'Memory Types'],
              ['api-memories', 'Memories API'],
              ['api-agents', 'Agents API'],
              ['api-sync', 'Sync API'],
              ['api-graph', 'Graph API'],
              ['concepts', 'Core Concepts'],
            ].map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                className="block text-aether-dim hover:text-aether-text transition-colors py-1 font-mono text-xs"
              >
                {label}
              </a>
            ))}
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 space-y-12 min-w-0">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <BookOpen size={18} className="text-indigo-400" />
              <h1 className="font-display text-3xl font-bold text-aether-text">Documentation</h1>
            </div>
            <p className="text-aether-dim">Everything you need to connect your AI agents to the universal memory layer.</p>
          </div>

          <Section id="intro" title="Introduction">
            <p className="text-aether-dim leading-relaxed">
              Aether Protocol is an open-source infrastructure layer that gives AI systems persistent, portable, and interoperable memory. Every agent — ChatGPT, Claude, Cursor, your custom bots — can share the same structured memory through a simple REST API.
            </p>
            <div className="grid grid-cols-3 gap-4 mt-4">
              {[
                { icon: Brain, title: 'Persistent', desc: 'Memories survive across sessions and conversations' },
                { icon: Globe, title: 'Portable', desc: 'Any agent can read any memory in shared namespaces' },
                { icon: Shield, title: 'Structured', desc: 'Typed objects, not raw text — with metadata and scoring' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="aether-card p-4 text-center">
                  <Icon size={18} className="text-indigo-400 mx-auto mb-2" />
                  <div className="text-sm font-semibold text-aether-text">{title}</div>
                  <div className="text-xs text-aether-dim mt-1">{desc}</div>
                </div>
              ))}
            </div>
          </Section>

          <Section id="quickstart" title="Quickstart">
            <p className="text-aether-dim">Get started in 3 steps:</p>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-xs font-mono text-indigo-400 flex-shrink-0 mt-0.5">1</div>
                <div>
                  <p className="text-sm text-aether-text mb-2">Register an agent from the dashboard to get your API key.</p>
                  <Link href="/dashboard/agents" className="text-xs text-indigo-400 hover:underline">→ Dashboard / Agents</Link>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-xs font-mono text-indigo-400 flex-shrink-0 mt-0.5">2</div>
                <div>
                  <p className="text-sm text-aether-text mb-2">Push your first memory:</p>
                  <Code>{`curl -X POST https://your-domain.vercel.app/api/sync \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"memories": [{"type": "FACT", "content": "User prefers TypeScript"}]}'`}</Code>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-xs font-mono text-indigo-400 flex-shrink-0 mt-0.5">3</div>
                <div>
                  <p className="text-sm text-aether-text mb-2">Pull from any other agent:</p>
                  <Code>{`curl https://your-domain.vercel.app/api/sync \\
  -H "Authorization: Bearer OTHER_AGENT_API_KEY"`}</Code>
                </div>
              </div>
            </div>
          </Section>

          <Section id="memory-types" title="Memory Types">
            <p className="text-aether-dim mb-4">Aether supports 7 structured memory types:</p>
            <div className="space-y-3">
              {[
                { type: 'FACT', color: 'text-indigo-400', desc: 'Objective facts about the user, world, or context.', ex: '"User lives in Bangalore"' },
                { type: 'EVENT', color: 'text-cyan-400', desc: 'Things that happened, with temporal context.', ex: '"User deployed Aether to Vercel on June 2025"' },
                { type: 'PREFERENCE', color: 'text-purple-400', desc: 'User preferences, likes, dislikes, and habits.', ex: '"User prefers concise responses"' },
                { type: 'RELATIONSHIP', color: 'text-amber-400', desc: 'Connections between entities.', ex: '"Aether Protocol is created_by User"' },
                { type: 'CONTEXT', color: 'text-slate-400', desc: 'Short-lived situational context, often expires.', ex: '"Currently working on API auth"' },
                { type: 'SKILL', color: 'text-emerald-400', desc: 'Capabilities or expertise the user has.', ex: '"Proficient in React and TypeScript"' },
                { type: 'GOAL', color: 'text-red-400', desc: 'Intentions, objectives, and targets.', ex: '"Launch Aether Protocol by Q3"' },
              ].map(({ type, color, desc, ex }) => (
                <div key={type} className="aether-card p-4 flex gap-4">
                  <span className={`font-mono text-xs font-bold w-28 flex-shrink-0 ${color}`}>{type}</span>
                  <div>
                    <p className="text-sm text-aether-text">{desc}</p>
                    <p className="text-xs text-aether-dim/60 mt-1 font-mono">{ex}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section id="api-memories" title="Memories API">
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">GET</span>
                  <InlineCode>/api/memories</InlineCode>
                </div>
                <p className="text-sm text-aether-dim mb-3">List and search memories. Supports full-text search.</p>
                <Code>{`# List all memories
GET /api/memories

# Search with filters
GET /api/memories?query=typescript&type=FACT&namespace=global&limit=20&page=1`}</Code>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded">POST</span>
                  <InlineCode>/api/memories</InlineCode>
                </div>
                <p className="text-sm text-aether-dim mb-3">Create a new memory.</p>
                <Code>{`{
  "type": "FACT",           // required: FACT | EVENT | PREFERENCE | RELATIONSHIP | CONTEXT | SKILL | GOAL
  "content": "...",         // required: the memory content
  "namespace": "global",    // optional: partition key (default: "global")
  "importance": 0.8,        // optional: 0–1 (auto-computed if omitted)
  "confidence": 1.0,        // optional: 0–1
  "expiresAt": "2025-12-31T00:00:00Z", // optional: ISO date
  "tags": ["ai", "project"], // optional: string array
  "agentId": "..."           // optional: link to an agent
}`}</Code>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded">PATCH</span>
                  <InlineCode>/api/memories/:id</InlineCode>
                </div>
                <p className="text-sm text-aether-dim mb-3">Update any field of an existing memory.</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded">DELETE</span>
                  <InlineCode>/api/memories/:id</InlineCode>
                </div>
                <p className="text-sm text-aether-dim">Permanently delete a memory and its relations.</p>
              </div>
            </div>
          </Section>

          <Section id="api-agents" title="Agents API">
            <p className="text-aether-dim mb-4">
              Agents are AI systems registered with Aether. Each gets a unique API key for authenticated sync operations.
            </p>
            <Code>{`# Register a new agent
POST /api/agents
{ "name": "My Agent", "description": "Optional description" }

# Returns:
{
  "id": "clxxx...",
  "name": "My Agent",
  "apiKey": "clyyy...",   // ← use this for sync operations
  "createdAt": "..."
}

# List all agents
GET /api/agents

# Delete an agent
DELETE /api/agents/:id`}</Code>
          </Section>

          <Section id="api-sync" title="Sync API">
            <p className="text-aether-dim mb-2">
              The primary integration point. Requires an agent API key via{' '}
              <InlineCode>Authorization: Bearer YOUR_KEY</InlineCode> header.
            </p>
            <div className="space-y-4 mt-4">
              <div>
                <p className="text-sm font-semibold text-aether-text mb-2">Push memories (bulk create)</p>
                <Code>{`POST /api/sync
Authorization: Bearer YOUR_API_KEY

{
  "memories": [
    { "type": "FACT", "content": "User prefers dark mode" },
    { "type": "GOAL", "content": "Ship v1 by end of month" }
  ]
}`}</Code>
              </div>
              <div>
                <p className="text-sm font-semibold text-aether-text mb-2">Pull memories</p>
                <Code>{`GET /api/sync
Authorization: Bearer YOUR_API_KEY

# Optional params:
# ?namespace=global   - filter by namespace
# ?since=2025-01-01   - only memories updated after this date

# Returns agent's own memories + all global namespace memories`}</Code>
              </div>
            </div>
          </Section>

          <Section id="api-graph" title="Knowledge Graph API">
            <p className="text-aether-dim mb-4">Create typed relations between memories to build a knowledge graph.</p>
            <Code>{`# Get graph data (nodes + edges)
GET /api/graph?namespace=global

# Create a relation
POST /api/graph
{
  "fromId": "memory_id_1",
  "toId": "memory_id_2",
  "relation": "created_by",   // any string
  "weight": 1.0               // optional: 0–1
}

# Common relation types:
# related_to, created_by, depends_on, contradicts,
# supports, part_of, instance_of, motivated_by`}</Code>
          </Section>

          <Section id="concepts" title="Core Concepts">
            <div className="space-y-4">
              {[
                {
                  title: 'Namespaces',
                  desc: 'Namespaces partition memory. The "global" namespace is readable by all agents. Custom namespaces (like "project-x" or "technical") scope memory to specific domains. Use them to avoid noise across unrelated agents.'
                },
                {
                  title: 'Importance Scoring',
                  desc: 'Every memory has an importance score from 0 to 1. Aether auto-computes this based on type, metadata, and tags — GOAL memories start high, CONTEXT starts low. Override with the importance field. Scores affect retrieval ordering.'
                },
                {
                  title: 'Memory Lifecycle',
                  desc: 'Set expiresAt on any memory to make it expire automatically. Use confidence scores to mark uncertain memories. The accessCount and lastAccessed fields track usage over time.'
                },
                {
                  title: 'Knowledge Graph',
                  desc: 'Memories can be connected with typed, weighted relations. This lets agents traverse context: "User likes AI" → motivated_by → "Started Aether Protocol". Relations are directional but queryable from either side.'
                },
              ].map(({ title, desc }) => (
                <div key={title} className="aether-card p-5">
                  <h3 className="font-display font-semibold text-aether-text mb-2">{title}</h3>
                  <p className="text-sm text-aether-dim leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </Section>

          <div className="aether-card p-6 border-indigo-500/30">
            <div className="flex items-center gap-2 mb-3">
              <Terminal size={16} className="text-indigo-400" />
              <span className="font-display font-semibold text-aether-text">Try it live</span>
            </div>
            <p className="text-sm text-aether-dim mb-4">
              Use the API Playground to test any endpoint directly in the browser.
            </p>
            <Link href="/playground" className="aether-button text-sm inline-flex items-center gap-2">
              <Zap size={13} /> Open Playground
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
