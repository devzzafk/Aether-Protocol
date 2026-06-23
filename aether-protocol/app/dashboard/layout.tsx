'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Brain, LayoutDashboard, Database, Bot, GitBranch, BookOpen, FlaskConical, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/memories', label: 'Memories', icon: Database },
  { href: '/dashboard/agents', label: 'Agents', icon: Bot },
  { href: '/dashboard/graph', label: 'Knowledge Graph', icon: GitBranch },
  { href: '/playground', label: 'Playground', icon: FlaskConical },
  { href: '/docs', label: 'Docs', icon: BookOpen },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-aether-void flex">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-56 bg-aether-deep border-r border-aether-border flex flex-col transition-transform duration-300",
        "md:translate-x-0",
        mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="h-16 flex items-center gap-2.5 px-5 border-b border-aether-border">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
            <Brain size={14} className="text-white" />
          </div>
          <div>
            <div className="font-display font-semibold text-sm text-aether-text leading-tight">Aether</div>
            <div className="text-[10px] text-aether-dim font-mono leading-tight">Protocol</div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
                  active
                    ? "bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                    : "text-aether-dim hover:text-aether-text hover:bg-aether-surface"
                )}
              >
                <Icon size={15} />
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-aether-border">
          <div className="text-[10px] text-aether-dim font-mono text-center">
            v0.1.0-alpha
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 md:ml-56 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="h-16 border-b border-aether-border bg-aether-void/80 backdrop-blur-sm sticky top-0 z-30 flex items-center px-6 gap-4">
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden text-aether-dim hover:text-aether-text"
          >
            <Menu size={20} />
          </button>
          <div className="flex-1" />
          <Link href="/" className="text-xs text-aether-dim hover:text-aether-text transition-colors">
            ← Home
          </Link>
        </header>
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
