'use client'
import { useEffect, useState, useCallback } from 'react'
import { Bot, Plus, Trash2, Copy, Check, Key, Database } from 'lucide-react'
import { Agent } from '@/types'
import { formatDistanceToNow } from 'date-fns'

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button onClick={copy} className="text-aether-dim hover:text-aether-text transition-colors p-1">
      {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
    </button>
  )
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({ name: '', description: '' })

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/agents')
    const json = await res.json()
    if (json.success) setAgents(json.data)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function create() {
    if (!form.name.trim()) return
    setCreating(true)
    const res = await fetch('/api/agents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    if (res.ok) {
      setShowCreate(false)
      setForm({ name: '', description: '' })
      load()
    }
    setCreating(false)
  }

  async function deleteAgent(id: string) {
    if (!confirm('Delete this agent? Its memories will be kept.')) return
    await fetch(`/api/agents/${id}`, { method: 'DELETE' })
    load()
  }

  const EXAMPLE_AGENTS = ['ChatGPT', 'Claude', 'Cursor', 'Research Agent', 'Calendar Bot', 'Email Assistant']

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-aether-text">Agents</h1>
          <p className="text-aether-dim text-sm mt-1">AI systems connected to Aether</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="aether-button text-sm flex items-center gap-2">
          <Plus size={14} /> Register Agent
        </button>
      </div>

      {/* Create form */}
      {showCreate && (
        <div className="aether-card p-6 border-indigo-500/30">
          <h3 className="font-display font-semibold text-aether-text mb-4">Register New Agent</h3>
          <p className="text-sm text-aether-dim mb-4">An API key will be generated automatically for this agent.</p>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-aether-dim block mb-1.5">Agent Name</label>
              <input
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                placeholder="e.g. ChatGPT Agent, Cursor, Research Bot"
                className="aether-input text-sm"
              />
              <div className="flex gap-2 mt-2 flex-wrap">
                {EXAMPLE_AGENTS.map(n => (
                  <button key={n} onClick={() => setForm(p => ({ ...p, name: n }))}
                    className="text-[10px] font-mono border border-aether-border rounded px-2 py-0.5 text-aether-dim hover:text-aether-text hover:border-indigo-500/40 transition-colors">
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-aether-dim block mb-1.5">Description (optional)</label>
              <input
                value={form.description}
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                placeholder="What does this agent do?"
                className="aether-input text-sm"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={create} disabled={creating || !form.name.trim()} className="aether-button text-sm flex items-center gap-2">
                {creating ? <><span className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" /> Registering…</> : 'Register Agent'}
              </button>
              <button onClick={() => setShowCreate(false)} className="aether-button-ghost text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Agent list */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : agents.length === 0 ? (
        <div className="aether-card p-12 text-center">
          <Bot size={32} className="text-aether-muted mx-auto mb-4" />
          <p className="text-aether-dim mb-2">No agents registered.</p>
          <p className="text-sm text-aether-dim/60">Register an agent to start syncing memories via API.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {agents.map(agent => (
            <div key={agent.id} className="aether-card p-5 hover:border-aether-muted transition-colors group relative">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                  <Bot size={16} className="text-indigo-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-semibold text-aether-text truncate">{agent.name}</h3>
                  {agent.description && (
                    <p className="text-xs text-aether-dim mt-0.5 truncate">{agent.description}</p>
                  )}
                </div>
                <button
                  onClick={() => deleteAgent(agent.id)}
                  className="opacity-0 group-hover:opacity-100 text-aether-dim hover:text-red-400 transition-all p-1"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1.5 text-xs text-aether-dim">
                  <Database size={11} />
                  <span>{agent._count?.memories ?? 0} memories</span>
                </div>
                <div className="text-xs text-aether-dim/50 font-mono">
                  {formatDistanceToNow(new Date(agent.createdAt), { addSuffix: true })}
                </div>
              </div>

              {/* API Key */}
              <div className="border border-aether-border rounded-lg p-3 bg-aether-deep">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 text-[10px] text-aether-dim">
                    <Key size={10} />
                    <span className="uppercase tracking-widest">API Key</span>
                  </div>
                  <CopyButton text={agent.apiKey} />
                </div>
                <div className="font-mono text-xs text-aether-dim/60 truncate">{agent.apiKey}</div>
              </div>

              {/* Usage snippet */}
              <div className="mt-3 text-[10px] font-mono text-aether-dim/40 leading-relaxed">
                Authorization: Bearer {agent.apiKey.slice(0, 16)}…
              </div>
            </div>
          ))}
        </div>
      )}

      {/* How to use */}
      <div className="aether-card p-6">
        <h3 className="font-display font-semibold text-aether-text mb-4">Using the Sync API</h3>
        <pre className="text-xs font-mono text-aether-dim bg-aether-deep rounded-lg p-4 overflow-x-auto">
{`// Push memories from your agent
await fetch("/api/sync", {
  method: "POST",
  headers: {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    memories: [
      { type: "FACT", content: "User prefers TypeScript" },
      { type: "GOAL", content: "Launch by Q3" }
    ]
  })
})

// Pull all accessible memories
await fetch("/api/sync", {
  headers: { "Authorization": "Bearer YOUR_API_KEY" }
})`}
        </pre>
      </div>
    </div>
  )
}
