'use client'
import { useState } from 'react'
import { FlaskConical, Play, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react'

const EXAMPLES = [
  {
    label: 'Create a memory',
    method: 'POST',
    path: '/api/memories',
    body: JSON.stringify({
      type: 'FACT',
      content: 'User is building Aether Protocol, a universal AI memory layer',
      namespace: 'global',
      importance: 0.9,
      tags: ['aether', 'project', 'ai'],
    }, null, 2)
  },
  {
    label: 'Search memories',
    method: 'GET',
    path: '/api/memories?query=AI&limit=10',
    body: ''
  },
  {
    label: 'List all agents',
    method: 'GET',
    path: '/api/agents',
    body: ''
  },
  {
    label: 'Register an agent',
    method: 'POST',
    path: '/api/agents',
    body: JSON.stringify({
      name: 'My Custom Agent',
      description: 'A custom AI assistant'
    }, null, 2)
  },
  {
    label: 'Dashboard stats',
    method: 'GET',
    path: '/api/dashboard',
    body: ''
  },
  {
    label: 'Knowledge graph',
    method: 'GET',
    path: '/api/graph',
    body: ''
  },
  {
    label: 'Bulk sync memories',
    method: 'POST',
    path: '/api/sync',
    body: JSON.stringify({
      memories: [
        { type: 'PREFERENCE', content: 'User prefers dark mode', namespace: 'global' },
        { type: 'GOAL', content: 'Build AI memory OS by end of year', namespace: 'global' }
      ]
    }, null, 2)
  },
]

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
      className="text-aether-dim hover:text-aether-text transition-colors"
    >
      {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
    </button>
  )
}

export default function PlaygroundPage() {
  const [method, setMethod] = useState('GET')
  const [path, setPath] = useState('/api/memories')
  const [body, setBody] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [response, setResponse] = useState('')
  const [status, setStatus] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [showExamples, setShowExamples] = useState(true)

  async function run() {
    setLoading(true)
    setResponse('')
    setStatus(null)
    try {
      const opts: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {})
        }
      }
      if (body && method !== 'GET') {
        opts.body = body
      }
      const res = await fetch(path, opts)
      setStatus(res.status)
      const json = await res.json()
      setResponse(JSON.stringify(json, null, 2))
    } catch (e) {
      setResponse(String(e))
    }
    setLoading(false)
  }

  function loadExample(ex: typeof EXAMPLES[0]) {
    setMethod(ex.method)
    setPath(ex.path)
    setBody(ex.body)
  }

  const statusColor = status
    ? status < 300 ? 'text-emerald-400' : status < 400 ? 'text-amber-400' : 'text-red-400'
    : 'text-aether-dim'

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-aether-text flex items-center gap-2">
          <FlaskConical size={20} className="text-indigo-400" />
          API Playground
        </h1>
        <p className="text-aether-dim text-sm mt-1">Test the Aether Protocol REST API directly in the browser.</p>
      </div>

      {/* Examples */}
      <div className="aether-card overflow-hidden">
        <button
          onClick={() => setShowExamples(v => !v)}
          className="w-full flex items-center justify-between px-5 py-3 text-sm font-medium text-aether-text hover:bg-aether-surface/50 transition-colors"
        >
          <span>Example Requests</span>
          {showExamples ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {showExamples && (
          <div className="px-5 pb-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {EXAMPLES.map(ex => (
              <button
                key={ex.label}
                onClick={() => loadExample(ex)}
                className="text-left border border-aether-border hover:border-indigo-500/40 rounded-lg p-3 text-xs transition-all hover:bg-indigo-500/5"
              >
                <div className={`font-mono mb-1 ${ex.method === 'POST' ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {ex.method}
                </div>
                <div className="text-aether-dim">{ex.label}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Request builder */}
      <div className="aether-card p-5 space-y-4">
        <h3 className="font-display font-semibold text-aether-text">Request</h3>

        <div className="flex gap-3">
          <select
            value={method}
            onChange={e => setMethod(e.target.value)}
            className="aether-input appearance-none w-24 font-mono text-sm"
          >
            <option>GET</option>
            <option>POST</option>
            <option>PATCH</option>
            <option>DELETE</option>
          </select>
          <input
            value={path}
            onChange={e => setPath(e.target.value)}
            className="aether-input flex-1 font-mono text-sm"
            placeholder="/api/memories"
          />
        </div>

        <div>
          <label className="text-xs text-aether-dim block mb-1.5">API Key (optional, for /api/sync)</label>
          <input
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            placeholder="Your agent API key"
            className="aether-input text-sm font-mono"
          />
        </div>

        {method !== 'GET' && (
          <div>
            <label className="text-xs text-aether-dim block mb-1.5">Request Body (JSON)</label>
            <textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              className="aether-input font-mono text-xs resize-none"
              rows={8}
              placeholder='{"type": "FACT", "content": "..."}'
            />
          </div>
        )}

        <button
          onClick={run}
          disabled={loading}
          className="aether-button flex items-center gap-2 text-sm"
        >
          {loading
            ? <><span className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" /> Running…</>
            : <><Play size={13} /> Send Request</>
          }
        </button>
      </div>

      {/* Response */}
      {(response || loading) && (
        <div className="aether-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-aether-text">Response</h3>
            <div className="flex items-center gap-3">
              {status && (
                <span className={`font-mono text-sm ${statusColor}`}>
                  {status}
                </span>
              )}
              {response && <CopyBtn text={response} />}
            </div>
          </div>
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-aether-dim font-mono">
              <span className="w-3 h-3 border border-indigo-500 border-t-transparent rounded-full animate-spin" />
              Waiting for response…
            </div>
          ) : (
            <pre className="text-xs font-mono text-aether-dim bg-aether-deep rounded-lg p-4 overflow-x-auto max-h-96 overflow-y-auto">
              {response}
            </pre>
          )}
        </div>
      )}

      {/* API reference quick links */}
      <div className="aether-card p-5">
        <h3 className="font-display font-semibold text-aether-text mb-3">Available Endpoints</h3>
        <div className="space-y-2 font-mono text-xs">
          {[
            ['GET', '/api/memories', 'List/search memories'],
            ['POST', '/api/memories', 'Create a memory'],
            ['GET', '/api/memories/:id', 'Get memory by ID'],
            ['PATCH', '/api/memories/:id', 'Update memory'],
            ['DELETE', '/api/memories/:id', 'Delete memory'],
            ['GET', '/api/agents', 'List agents'],
            ['POST', '/api/agents', 'Register agent'],
            ['DELETE', '/api/agents/:id', 'Delete agent'],
            ['GET', '/api/graph', 'Knowledge graph data'],
            ['POST', '/api/graph', 'Create a relation'],
            ['POST', '/api/sync', 'Bulk push memories (auth)'],
            ['GET', '/api/sync', 'Pull memories (auth)'],
            ['GET', '/api/dashboard', 'Dashboard stats'],
            ['POST', '/api/seed', 'Load demo data'],
          ].map(([m, p, desc]) => (
            <div key={p + m} className="flex items-center gap-3 py-1.5 border-b border-aether-border/50 last:border-0">
              <span className={`w-14 ${m === 'POST' ? 'text-amber-400' : m === 'DELETE' ? 'text-red-400' : m === 'PATCH' ? 'text-purple-400' : 'text-emerald-400'}`}>{m}</span>
              <span className="text-aether-dim w-48">{p}</span>
              <span className="text-aether-dim/50">{desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
