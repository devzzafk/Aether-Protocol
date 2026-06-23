'use client'
import { useEffect, useState } from 'react'
import { Database, Bot, GitBranch, Activity, TrendingUp, Zap } from 'lucide-react'
import { DashboardStats } from '@/types'
import { formatDistanceToNow } from 'date-fns'

const TYPE_COLORS: Record<string, string> = {
  FACT: 'bg-indigo-500',
  EVENT: 'bg-cyan-500',
  PREFERENCE: 'bg-purple-500',
  RELATIONSHIP: 'bg-amber-500',
  CONTEXT: 'bg-slate-500',
  SKILL: 'bg-emerald-500',
  GOAL: 'bg-red-500',
}

function StatCard({ icon: Icon, label, value, sub }: { icon: React.ElementType, label: string, value: number | string, sub?: string }) {
  return (
    <div className="aether-card p-5 flex items-start gap-4">
      <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
        <Icon size={18} className="text-indigo-400" />
      </div>
      <div>
        <div className="text-2xl font-display font-bold text-aether-text">{value}</div>
        <div className="text-sm text-aether-dim">{label}</div>
        {sub && <div className="text-xs text-aether-dim/60 mt-0.5">{sub}</div>}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [seeding, setSeeding] = useState(false)
  const [seedMsg, setSeedMsg] = useState('')

  async function loadStats() {
    const res = await fetch('/api/dashboard')
    const json = await res.json()
    if (json.success) setStats(json.data)
    setLoading(false)
  }

  async function seed() {
    setSeeding(true)
    const res = await fetch('/api/seed', { method: 'POST' })
    const json = await res.json()
    if (json.success) {
      setSeedMsg('Demo data loaded!')
      loadStats()
    } else {
      setSeedMsg(json.error || 'Seed failed')
    }
    setSeeding(false)
    setTimeout(() => setSeedMsg(''), 3000)
  }

  useEffect(() => { loadStats() }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-aether-dim text-sm font-mono">Connecting to memory layer…</span>
      </div>
    </div>
  )

  const totalMemories = stats?.totalMemories ?? 0
  const totalAgents = stats?.totalAgents ?? 0
  const totalRelations = stats?.totalRelations ?? 0

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-aether-text">Memory Overview</h1>
          <p className="text-aether-dim text-sm mt-1">Your universal AI memory layer</p>
        </div>
        <div className="flex items-center gap-3">
          {seedMsg && <span className="text-xs text-emerald-400 font-mono">{seedMsg}</span>}
          {totalMemories === 0 && (
            <button
              onClick={seed}
              disabled={seeding}
              className="aether-button text-sm flex items-center gap-2"
            >
              {seeding ? (
                <><span className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />Loading demo…</>
              ) : (
                <><Zap size={14} />Load demo data</>
              )}
            </button>
          )}
          <button onClick={loadStats} className="aether-button-ghost text-sm">
            Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={Database} label="Total Memories" value={totalMemories} sub="across all agents" />
        <StatCard icon={Bot} label="Connected Agents" value={totalAgents} sub="registered identities" />
        <StatCard icon={GitBranch} label="Relations" value={totalRelations} sub="knowledge graph edges" />
      </div>

      {/* Memory types breakdown */}
      {stats && Object.keys(stats.memoriesByType).length > 0 && (
        <div className="aether-card p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp size={16} className="text-indigo-400" />
            <h2 className="font-display font-semibold text-aether-text">Memory by Type</h2>
          </div>
          <div className="space-y-3">
            {Object.entries(stats.memoriesByType).map(([type, count]) => {
              const pct = totalMemories > 0 ? (count / totalMemories) * 100 : 0
              return (
                <div key={type} className="flex items-center gap-3">
                  <span className="text-xs font-mono text-aether-dim w-24 flex-shrink-0">{type}</span>
                  <div className="flex-1 bg-aether-muted rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${TYPE_COLORS[type] ?? 'bg-indigo-500'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono text-aether-dim w-6 text-right">{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Namespaces */}
      {stats && stats.topNamespaces.length > 0 && (
        <div className="aether-card p-6">
          <h2 className="font-display font-semibold text-aether-text mb-4">Active Namespaces</h2>
          <div className="flex flex-wrap gap-2">
            {stats.topNamespaces.map(n => (
              <div key={n.namespace} className="flex items-center gap-2 border border-aether-border rounded-full px-3 py-1 text-xs font-mono">
                <span className="text-aether-dim">{n.namespace}</span>
                <span className="text-indigo-400">{n.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent activity */}
      {stats && stats.recentActivity.length > 0 && (
        <div className="aether-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={16} className="text-indigo-400" />
            <h2 className="font-display font-semibold text-aether-text">Recent Activity</h2>
          </div>
          <div className="space-y-2">
            {stats.recentActivity.map((log) => (
              <div key={log.id} className="flex items-center gap-3 py-2 border-b border-aether-border/50 last:border-0">
                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${log.status === 'success' ? 'bg-emerald-400' : 'bg-red-400'}`} />
                <span className="text-xs font-mono text-aether-dim flex-shrink-0 w-32">{log.action}</span>
                <span className="text-xs text-aether-dim truncate flex-1">agent:{log.agentId.slice(0, 8)}…</span>
                <span className="text-xs text-aether-dim/50 flex-shrink-0">
                  {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {totalMemories === 0 && !loading && (
        <div className="aether-card p-12 text-center">
          <Database size={32} className="text-aether-muted mx-auto mb-4" />
          <p className="text-aether-dim mb-2">No memories yet.</p>
          <p className="text-sm text-aether-dim/60">Load demo data above or connect an agent via the API.</p>
        </div>
      )}
    </div>
  )
}
