'use client'
import { useEffect, useState, useCallback } from 'react'
import { Database, Search, Plus, Trash2, Tag, Clock, Filter } from 'lucide-react'
import { Memory, MemoryType } from '@/types'
import { formatDistanceToNow } from 'date-fns'

const TYPES: MemoryType[] = ['FACT', 'EVENT', 'PREFERENCE', 'RELATIONSHIP', 'CONTEXT', 'SKILL', 'GOAL']
const TYPE_COLORS: Record<string, string> = {
  FACT: 'text-indigo-400 border-indigo-500/40 bg-indigo-500/5',
  EVENT: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/5',
  PREFERENCE: 'text-purple-400 border-purple-500/40 bg-purple-500/5',
  RELATIONSHIP: 'text-amber-400 border-amber-500/40 bg-amber-500/5',
  CONTEXT: 'text-slate-400 border-slate-500/40 bg-slate-500/5',
  SKILL: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/5',
  GOAL: 'text-red-400 border-red-500/40 bg-red-500/5',
}

function MemoryBadge({ type }: { type: MemoryType }) {
  return (
    <span className={`aether-badge border text-[10px] ${TYPE_COLORS[type]}`}>{type}</span>
  )
}

function ImportanceBar({ value }: { value: number }) {
  const color = value >= 0.8 ? 'bg-red-400' : value >= 0.6 ? 'bg-amber-400' : value >= 0.4 ? 'bg-indigo-400' : 'bg-slate-500'
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-12 h-1 bg-aether-muted rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value * 100}%` }} />
      </div>
      <span className="text-[10px] font-mono text-aether-dim">{(value * 100).toFixed(0)}%</span>
    </div>
  )
}

export default function MemoriesPage() {
  const [memories, setMemories] = useState<Memory[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('')
  const [showCreate, setShowCreate] = useState(false)
  const [creating, setCreating] = useState(false)
  const [page, setPage] = useState(1)

  const [newMemory, setNewMemory] = useState({
    type: 'FACT' as MemoryType,
    content: '',
    namespace: 'global',
    tags: '',
    importance: '0.5',
  })

  const load = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: '20' })
    if (query) params.set('query', query)
    if (typeFilter) params.set('type', typeFilter)
    const res = await fetch(`/api/memories?${params}`)
    const json = await res.json()
    if (json.success) {
      setMemories(json.data.memories)
      setTotal(json.data.total)
    }
    setLoading(false)
  }, [query, typeFilter, page])

  useEffect(() => { load() }, [load])

  async function create() {
    if (!newMemory.content.trim()) return
    setCreating(true)
    const res = await fetch('/api/memories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...newMemory,
        importance: parseFloat(newMemory.importance),
        tags: newMemory.tags ? newMemory.tags.split(',').map(t => t.trim()) : [],
      })
    })
    if (res.ok) {
      setShowCreate(false)
      setNewMemory({ type: 'FACT', content: '', namespace: 'global', tags: '', importance: '0.5' })
      load()
    }
    setCreating(false)
  }

  async function deleteMemory(id: string) {
    if (!confirm('Delete this memory?')) return
    await fetch(`/api/memories/${id}`, { method: 'DELETE' })
    load()
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-aether-text">Memories</h1>
          <p className="text-aether-dim text-sm mt-1">{total} total memories</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="aether-button text-sm flex items-center gap-2">
          <Plus size={14} /> New Memory
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-aether-dim" />
          <input
            value={query}
            onChange={e => { setQuery(e.target.value); setPage(1) }}
            placeholder="Search memories…"
            className="aether-input pl-9 text-sm"
          />
        </div>
        <div className="relative">
          <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-aether-dim pointer-events-none" />
          <select
            value={typeFilter}
            onChange={e => { setTypeFilter(e.target.value); setPage(1) }}
            className="aether-input pl-9 pr-4 text-sm appearance-none min-w-36"
          >
            <option value="">All types</option>
            {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {/* Create form */}
      {showCreate && (
        <div className="aether-card p-6 border-indigo-500/30">
          <h3 className="font-display font-semibold text-aether-text mb-4">New Memory</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-aether-dim block mb-1.5">Type</label>
                <select value={newMemory.type} onChange={e => setNewMemory(p => ({ ...p, type: e.target.value as MemoryType }))} className="aether-input text-sm appearance-none">
                  {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-aether-dim block mb-1.5">Namespace</label>
                <input value={newMemory.namespace} onChange={e => setNewMemory(p => ({ ...p, namespace: e.target.value }))} className="aether-input text-sm" placeholder="global" />
              </div>
            </div>
            <div>
              <label className="text-xs text-aether-dim block mb-1.5">Content</label>
              <textarea
                value={newMemory.content}
                onChange={e => setNewMemory(p => ({ ...p, content: e.target.value }))}
                className="aether-input text-sm resize-none"
                rows={3}
                placeholder="What should Aether remember?"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-aether-dim block mb-1.5">Tags (comma separated)</label>
                <input value={newMemory.tags} onChange={e => setNewMemory(p => ({ ...p, tags: e.target.value }))} className="aether-input text-sm" placeholder="ai, project, user" />
              </div>
              <div>
                <label className="text-xs text-aether-dim block mb-1.5">Importance (0–1)</label>
                <input type="number" min="0" max="1" step="0.1" value={newMemory.importance} onChange={e => setNewMemory(p => ({ ...p, importance: e.target.value }))} className="aether-input text-sm" />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={create} disabled={creating || !newMemory.content.trim()} className="aether-button text-sm flex items-center gap-2">
                {creating ? <><span className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" /> Creating…</> : 'Create Memory'}
              </button>
              <button onClick={() => setShowCreate(false)} className="aether-button-ghost text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Memory list */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : memories.length === 0 ? (
        <div className="aether-card p-12 text-center">
          <Database size={28} className="text-aether-muted mx-auto mb-3" />
          <p className="text-aether-dim">No memories found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {memories.map(m => (
            <div key={m.id} className="aether-card p-4 hover:border-aether-muted transition-colors group">
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <MemoryBadge type={m.type} />
                    <span className="text-xs font-mono text-aether-dim/50">{m.namespace}</span>
                    {m.agent && (
                      <span className="text-xs font-mono text-aether-dim/50">via {m.agent.name}</span>
                    )}
                  </div>
                  <p className="text-sm text-aether-text leading-relaxed">{m.content}</p>
                  <div className="flex items-center gap-4 mt-3 flex-wrap">
                    <ImportanceBar value={m.importance} />
                    {m.tags.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Tag size={10} className="text-aether-dim/50" />
                        {m.tags.map(t => (
                          <span key={t} className="text-[10px] font-mono text-aether-dim/60 bg-aether-muted px-1.5 py-0.5 rounded">{t}</span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-1 text-[10px] font-mono text-aether-dim/40">
                      <Clock size={10} />
                      {formatDistanceToNow(new Date(m.createdAt), { addSuffix: true })}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => deleteMemory(m.id)}
                  className="opacity-0 group-hover:opacity-100 text-aether-dim hover:text-red-400 transition-all p-1.5"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {total > 20 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="aether-button-ghost text-sm disabled:opacity-30">← Prev</button>
          <span className="text-xs text-aether-dim font-mono">Page {page} of {Math.ceil(total / 20)}</span>
          <button disabled={page >= Math.ceil(total / 20)} onClick={() => setPage(p => p + 1)} className="aether-button-ghost text-sm disabled:opacity-30">Next →</button>
        </div>
      )}
    </div>
  )
}
