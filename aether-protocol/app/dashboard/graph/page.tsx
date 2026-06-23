'use client'
import { useEffect, useState, useRef, useCallback } from 'react'
import { GitBranch, ZoomIn, ZoomOut, RefreshCw } from 'lucide-react'

interface Node {
  id: string
  label: string
  type: string
  importance: number
  x?: number
  y?: number
  vx?: number
  vy?: number
}

interface Edge {
  source: string
  target: string
  relation: string
  weight: number
}

const TYPE_COLORS: Record<string, string> = {
  FACT: '#6366f1',
  EVENT: '#22d3ee',
  PREFERENCE: '#a855f7',
  RELATIONSHIP: '#f59e0b',
  CONTEXT: '#64748b',
  SKILL: '#10b981',
  GOAL: '#ef4444',
}

export default function GraphPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Node | null>(null)
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const animRef = useRef<number>(0)
  const nodesRef = useRef<Node[]>([])
  const edgesRef = useRef<Edge[]>([])
  const scaleRef = useRef(1)
  const offsetRef = useRef({ x: 0, y: 0 })

  async function loadGraph() {
    setLoading(true)
    const res = await fetch('/api/graph')
    const json = await res.json()
    if (json.success) {
      const w = window.innerWidth - 300
      const h = window.innerHeight - 150
      const ns = json.data.nodes.map((n: Node) => ({
        ...n,
        x: Math.random() * w,
        y: Math.random() * h,
        vx: 0,
        vy: 0,
      }))
      setNodes(ns)
      setEdges(json.data.edges)
      nodesRef.current = ns
      edgesRef.current = json.data.edges
    }
    setLoading(false)
  }

  useEffect(() => { loadGraph() }, [])

  // Force-directed layout simulation
  useEffect(() => {
    if (nodes.length === 0) return

    function simulate() {
      const ns = [...nodesRef.current]
      const es = edgesRef.current

      // Repulsion
      for (let i = 0; i < ns.length; i++) {
        for (let j = i + 1; j < ns.length; j++) {
          const dx = (ns[j].x ?? 0) - (ns[i].x ?? 0)
          const dy = (ns[j].y ?? 0) - (ns[i].y ?? 0)
          const dist = Math.sqrt(dx * dx + dy * dy) || 1
          const force = 3000 / (dist * dist)
          const fx = (dx / dist) * force
          const fy = (dy / dist) * force
          ns[i].vx = (ns[i].vx ?? 0) - fx
          ns[i].vy = (ns[i].vy ?? 0) - fy
          ns[j].vx = (ns[j].vx ?? 0) + fx
          ns[j].vy = (ns[j].vy ?? 0) + fy
        }
      }

      // Attraction along edges
      const nodeMap = new Map(ns.map(n => [n.id, n]))
      for (const e of es) {
        const a = nodeMap.get(e.source)
        const b = nodeMap.get(e.target)
        if (!a || !b) continue
        const dx = (b.x ?? 0) - (a.x ?? 0)
        const dy = (b.y ?? 0) - (a.y ?? 0)
        const dist = Math.sqrt(dx * dx + dy * dy) || 1
        const force = (dist - 120) * 0.03
        const fx = (dx / dist) * force
        const fy = (dy / dist) * force
        a.vx = (a.vx ?? 0) + fx
        a.vy = (a.vy ?? 0) + fy
        b.vx = (b.vx ?? 0) - fx
        b.vy = (b.vy ?? 0) - fy
      }

      // Center gravity
      const cx = 400, cy = 300
      for (const n of ns) {
        n.vx = (n.vx ?? 0) + ((cx - (n.x ?? cx)) * 0.002)
        n.vy = (n.vy ?? 0) + ((cy - (n.y ?? cy)) * 0.002)
        n.vx = (n.vx ?? 0) * 0.85
        n.vy = (n.vy ?? 0) * 0.85
        n.x = (n.x ?? 0) + (n.vx ?? 0)
        n.y = (n.y ?? 0) + (n.vy ?? 0)
      }

      nodesRef.current = ns
      draw()
      animRef.current = requestAnimationFrame(simulate)
    }

    animRef.current = requestAnimationFrame(simulate)
    return () => cancelAnimationFrame(animRef.current)
  }, [nodes.length, edges])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.save()
    ctx.translate(offsetRef.current.x, offsetRef.current.y)
    ctx.scale(scaleRef.current, scaleRef.current)

    const ns = nodesRef.current
    const es = edgesRef.current
    const nodeMap = new Map(ns.map(n => [n.id, n]))

    // Draw edges
    for (const e of es) {
      const a = nodeMap.get(e.source)
      const b = nodeMap.get(e.target)
      if (!a || !b) continue
      ctx.beginPath()
      ctx.moveTo(a.x ?? 0, a.y ?? 0)
      ctx.lineTo(b.x ?? 0, b.y ?? 0)
      ctx.strokeStyle = 'rgba(99,102,241,0.2)'
      ctx.lineWidth = 1
      ctx.stroke()

      // Edge label
      const mx = ((a.x ?? 0) + (b.x ?? 0)) / 2
      const my = ((a.y ?? 0) + (b.y ?? 0)) / 2
      ctx.fillStyle = 'rgba(100,116,139,0.6)'
      ctx.font = '9px JetBrains Mono, monospace'
      ctx.textAlign = 'center'
      ctx.fillText(e.relation, mx, my)
    }

    // Draw nodes
    for (const n of ns) {
      const r = 8 + n.importance * 12
      const color = TYPE_COLORS[n.type] ?? '#6366f1'

      // Glow
      const grd = ctx.createRadialGradient(n.x ?? 0, n.y ?? 0, 0, n.x ?? 0, n.y ?? 0, r * 2)
      grd.addColorStop(0, color + '30')
      grd.addColorStop(1, 'transparent')
      ctx.beginPath()
      ctx.arc(n.x ?? 0, n.y ?? 0, r * 2, 0, Math.PI * 2)
      ctx.fillStyle = grd
      ctx.fill()

      // Node circle
      ctx.beginPath()
      ctx.arc(n.x ?? 0, n.y ?? 0, r, 0, Math.PI * 2)
      ctx.fillStyle = color + '20'
      ctx.fill()
      ctx.strokeStyle = color
      ctx.lineWidth = 1.5
      ctx.stroke()

      // Label
      ctx.fillStyle = '#e2e8f0'
      ctx.font = '10px Inter, sans-serif'
      ctx.textAlign = 'center'
      const label = n.label.length > 30 ? n.label.slice(0, 30) + '…' : n.label
      ctx.fillText(label, n.x ?? 0, (n.y ?? 0) + r + 14)
    }

    ctx.restore()
  }, [])

  // Zoom controls
  function zoom(dir: number) {
    scaleRef.current = Math.max(0.3, Math.min(3, scaleRef.current + dir * 0.1))
    setScale(scaleRef.current)
  }

  return (
    <div className="h-full flex flex-col -m-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-aether-border bg-aether-deep/50">
        <div className="flex items-center gap-2">
          <GitBranch size={16} className="text-indigo-400" />
          <h1 className="font-display font-bold text-aether-text">Knowledge Graph</h1>
          <span className="text-xs font-mono text-aether-dim">
            {nodes.length} nodes · {edges.length} edges
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => zoom(-1)} className="aether-button-ghost p-2"><ZoomOut size={14} /></button>
          <span className="text-xs font-mono text-aether-dim w-10 text-center">{Math.round(scale * 100)}%</span>
          <button onClick={() => zoom(1)} className="aether-button-ghost p-2"><ZoomIn size={14} /></button>
          <button onClick={loadGraph} className="aether-button-ghost p-2"><RefreshCw size={14} /></button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative overflow-hidden bg-aether-void grid-bg">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-aether-dim text-sm font-mono">Building knowledge graph…</span>
            </div>
          </div>
        ) : nodes.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <GitBranch size={36} className="text-aether-muted mx-auto mb-4" />
              <p className="text-aether-dim">No graph data yet.</p>
              <p className="text-sm text-aether-dim/60 mt-1">Add memories and create relations to see the knowledge graph.</p>
            </div>
          </div>
        ) : (
          <canvas
            ref={canvasRef}
            width={1200}
            height={700}
            className="w-full h-full"
            style={{ cursor: 'crosshair' }}
          />
        )}

        {/* Legend */}
        {nodes.length > 0 && (
          <div className="absolute bottom-4 left-4 aether-card p-3 text-xs font-mono">
            <div className="text-aether-dim mb-2 uppercase tracking-wider text-[10px]">Memory Types</div>
            <div className="space-y-1">
              {Object.entries(TYPE_COLORS).map(([type, color]) => (
                <div key={type} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-aether-dim">{type}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
