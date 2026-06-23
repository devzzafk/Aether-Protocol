'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Brain, Zap, Globe, Lock, GitBranch, ChevronRight, Terminal, Database, Network, ArrowRight } from 'lucide-react'

const MEMORY_TYPES = ['FACT', 'EVENT', 'PREFERENCE', 'RELATIONSHIP', 'SKILL', 'GOAL']
const TYPE_COLORS: Record<string, string> = {
  FACT: 'text-indigo-400 border-indigo-500/40 bg-indigo-500/5',
  EVENT: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/5',
  PREFERENCE: 'text-purple-400 border-purple-500/40 bg-purple-500/5',
  RELATIONSHIP: 'text-amber-400 border-amber-500/40 bg-amber-500/5',
  SKILL: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/5',
  GOAL: 'text-red-400 border-red-500/40 bg-red-500/5',
}

const DEMO_MEMORIES = [
  { type: 'FACT', content: 'User is building Aether Protocol', agent: 'ChatGPT' },
  { type: 'PREFERENCE', content: 'Prefers TypeScript over JavaScript', agent: 'Cursor' },
  { type: 'GOAL', content: 'Build universal AI memory layer', agent: 'Research Agent' },
  { type: 'EVENT', content: 'Deployed first version to Vercel', agent: 'ChatGPT' },
  { type: 'SKILL', content: 'Proficient in Next.js and React', agent: 'Cursor' },
]

function AnimatedMemoryCard({ memory, delay }: { memory: typeof DEMO_MEMORIES[0], delay: number }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(t)
  }, [delay])

  return (
    <div className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className={`border rounded-lg p-3 text-sm font-mono ${TYPE_COLORS[memory.type]}`}>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] uppercase tracking-widest opacity-60">{memory.type}</span>
          <span className="text-[10px] opacity-40">{memory.agent}</span>
        </div>
        <p className="text-xs leading-relaxed opacity-80">{memory.content}</p>
      </div>
    </div>
  )
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="bg-aether-deep border border-aether-border rounded-xl p-4 text-xs font-mono text-aether-dim overflow-x-auto">
      <code dangerouslySetInnerHTML={{
        __html: code
          .replace(/(".*?")/g, '<span class="text-emerald-400">$1</span>')
          .replace(/\b(const|await|fetch|POST|GET)\b/g, '<span class="text-indigo-400">$1</span>')
          .replace(/\/\/.*/g, '<span class="text-slate-600">$&</span>')
      }} />
    </pre>
  )
}

const SYNC_CODE = `// Push memories from any agent
const res = await fetch("https://aether.ai/api/sync", {
  method: "POST",
  headers: {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    memories: [
      { type: "FACT", content: "User prefers dark mode" },
      { type: "GOAL", content: "Launch product by Q3" }
    ]
  })
})

// Pull from anywhere else
const mem = await fetch("/api/sync", {
  headers: { "Authorization": "Bearer YOUR_API_KEY" }
})`

export default function HomePage() {
  return (
    <div className="min-h-screen bg-aether-void grid-bg">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-aether-border bg-aether-void/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center">
              <Brain size={14} className="text-white" />
            </div>
            <span className="font-display font-semibold text-aether-text tracking-tight">Aether Protocol</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-aether-dim">
            <Link href="/docs" className="hover:text-aether-text transition-colors">Docs</Link>
            <Link href="/dashboard" className="hover:text-aether-text transition-colors">Dashboard</Link>
            <Link href="/playground" className="hover:text-aether-text transition-colors">Playground</Link>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-aether-text transition-colors">GitHub</a>
          </div>
          <Link href="/dashboard" className="aether-button text-sm">
            Open Dashboard
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-aether-glow pointer-events-none" />
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 border border-indigo-500/30 bg-indigo-500/5 rounded-full px-4 py-1.5 text-xs font-mono text-indigo-400 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              Open-source · Self-hostable · API-first
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight mb-6">
              <span className="text-aether-text">AI can think.</span>
              <br />
              <span className="aether-glow-text">Now it can remember.</span>
            </h1>
            <p className="text-aether-dim text-lg leading-relaxed max-w-xl mx-auto mb-10">
              Aether is a universal memory layer for AI systems. Every agent — ChatGPT, Cursor, your custom bots — shares the same persistent, structured memory.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link href="/dashboard" className="aether-button flex items-center gap-2 text-sm px-6 py-3">
                Open Dashboard <ArrowRight size={14} />
              </Link>
              <Link href="/docs" className="aether-button-ghost flex items-center gap-2 text-sm px-6 py-3">
                Read the Docs
              </Link>
            </div>
          </div>

          {/* Live memory feed demo */}
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <div className="aether-card p-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-xs font-mono text-aether-dim">ChatGPT Agent</span>
              </div>
              <div className="space-y-2">
                {DEMO_MEMORIES.slice(0, 2).map((m, i) => (
                  <AnimatedMemoryCard key={i} memory={m} delay={i * 300 + 500} />
                ))}
              </div>
            </div>
            <div className="aether-card p-4 border-indigo-500/30 glow-ring">
              <div className="flex items-center gap-2 mb-4">
                <Brain size={14} className="text-indigo-400" />
                <span className="text-xs font-mono text-indigo-400">Aether Protocol</span>
              </div>
              <div className="space-y-1.5">
                {MEMORY_TYPES.map((t, i) => (
                  <div key={t} className={`text-[10px] font-mono border rounded px-2 py-1 flex items-center justify-between ${TYPE_COLORS[t]}`}
                    style={{ animationDelay: `${i * 100}ms` }}>
                    <span>{t}</span>
                    <span className="opacity-40">✓</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="aether-card p-4 space-y-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono text-aether-dim">Cursor + Research</span>
              </div>
              <div className="space-y-2">
                {DEMO_MEMORIES.slice(2).map((m, i) => (
                  <AnimatedMemoryCard key={i} memory={m} delay={i * 300 + 800} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Aether */}
      <section className="py-24 px-6 border-t border-aether-border">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-center mb-4">Why not just a vector DB?</h2>
          <p className="text-aether-dim text-center max-w-xl mx-auto mb-16">
            Qdrant stores vectors. Aether stores <em>meaning</em>.
          </p>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
            <div className="aether-card p-6 opacity-60">
              <div className="text-xs font-mono text-red-400 mb-3 uppercase tracking-widest">Vector DB only</div>
              <div className="space-y-2 text-sm font-mono text-aether-dim">
                <div className="flex items-center gap-2"><span className="text-red-500">✗</span> Floats, no structure</div>
                <div className="flex items-center gap-2"><span className="text-red-500">✗</span> No memory lifecycle</div>
                <div className="flex items-center gap-2"><span className="text-red-500">✗</span> No agent identity</div>
                <div className="flex items-center gap-2"><span className="text-red-500">✗</span> No importance scoring</div>
                <div className="flex items-center gap-2"><span className="text-red-500">✗</span> No knowledge graph</div>
                <div className="flex items-center gap-2"><span className="text-red-500">✗</span> No shared namespaces</div>
              </div>
            </div>
            <div className="aether-card p-6 border-indigo-500/40 glow-ring">
              <div className="text-xs font-mono text-indigo-400 mb-3 uppercase tracking-widest">Aether Protocol</div>
              <div className="space-y-2 text-sm font-mono text-aether-text">
                <div className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Typed memory objects</div>
                <div className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Expiry + lifecycle</div>
                <div className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Agent identities</div>
                <div className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Importance scoring</div>
                <div className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Knowledge graph + relations</div>
                <div className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Shared namespaces</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 bg-aether-deep/50 border-t border-aether-border">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-center mb-16">Everything memory needs</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Database, title: 'Typed Memory Objects', desc: 'Facts, Events, Preferences, Goals, Skills, Relationships — each with metadata, tags, confidence, and importance scores.' },
              { icon: Network, title: 'Knowledge Graph', desc: 'Connect memories with typed relations. Traverse the graph to understand context across agents and sessions.' },
              { icon: Zap, title: 'Real-time Sync', desc: 'Push and pull via REST API. Any agent can sync memories with a single POST request using API key auth.' },
              { icon: Globe, title: 'Shared Namespaces', desc: 'Global memories flow to all agents. Scoped namespaces let you partition context by project or domain.' },
              { icon: Lock, title: 'Memory Lifecycle', desc: 'Set expiry dates, confidence scores, and importance. Memories decay naturally or persist forever.' },
              { icon: GitBranch, title: 'Agent Identities', desc: 'Every agent gets a unique API key and identity. Track which agent wrote which memory and when.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="aether-card p-6 hover:border-indigo-500/30 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
                  <Icon size={16} className="text-indigo-400" />
                </div>
                <h3 className="font-display font-semibold text-aether-text mb-2">{title}</h3>
                <p className="text-aether-dim text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code example */}
      <section className="py-24 px-6 border-t border-aether-border">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Terminal size={16} className="text-indigo-400" />
            <h2 className="font-display text-2xl font-bold">Two endpoints. Full memory.</h2>
          </div>
          <p className="text-aether-dim mb-8">Push from one agent, pull from any other. That&apos;s the entire protocol.</p>
          <CodeBlock code={SYNC_CODE} />
          <div className="mt-6 flex gap-3">
            <Link href="/docs" className="aether-button-ghost text-sm flex items-center gap-2">
              Full API Reference <ChevronRight size={14} />
            </Link>
            <Link href="/playground" className="aether-button-ghost text-sm flex items-center gap-2">
              Try Playground <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 border-t border-aether-border">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-4xl font-bold mb-4 aether-glow-text">Memory OS for AI</h2>
          <p className="text-aether-dim mb-8">
            Like Windows manages files, Aether manages memory. Open-source, self-hostable, built for the age of agents.
          </p>
          <Link href="/dashboard" className="aether-button inline-flex items-center gap-2 px-8 py-3">
            Launch Dashboard <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-aether-border py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-aether-dim">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center">
              <Brain size={10} className="text-white" />
            </div>
            <span className="font-mono">Aether Protocol</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/docs" className="hover:text-aether-text transition-colors">Docs</Link>
            <Link href="/dashboard" className="hover:text-aether-text transition-colors">Dashboard</Link>
            <Link href="/playground" className="hover:text-aether-text transition-colors">Playground</Link>
            <a href="https://github.com" className="hover:text-aether-text transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
