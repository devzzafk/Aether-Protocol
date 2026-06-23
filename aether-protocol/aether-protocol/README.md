# Aether Protocol

**Universal AI Memory Layer** — persistent, portable, interoperable memory for all AI agents.

```
ChatGPT ──┐
Claude   ──┤
Cursor   ──┤── Aether Protocol ── Shared Memory
Research ──┤
Calendar ──┘
```

## What is Aether?

Aether Protocol solves one problem: **AI can think, but it can't truly remember.**

Today every AI system has fragmented memory. ChatGPT remembers things only within its own ecosystem. Your coding agent remembers things only within a project. Aether provides a universal memory layer connecting them all.

## Features

- **7 typed memory objects** — FACT, EVENT, PREFERENCE, RELATIONSHIP, CONTEXT, SKILL, GOAL
- **Knowledge graph** — connect memories with typed, weighted relations
- **Agent identities** — unique API keys per agent for authenticated sync
- **Namespaces** — global shared memory + scoped partitions
- **Memory lifecycle** — expiry dates, confidence scores, importance scoring
- **REST API** — push and pull memories with a single HTTP call
- **Dashboard UI** — visual memory explorer, knowledge graph, agent manager

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL via Prisma ORM
- **UI**: Tailwind CSS + Framer Motion
- **Deployment**: Vercel + Vercel Postgres

## Quickstart

### 1. Clone & install

```bash
git clone https://github.com/your-username/aether-protocol
cd aether-protocol
npm install
```

### 2. Set up database

```bash
cp .env.example .env
# Edit .env with your DATABASE_URL
```

Get a free PostgreSQL database from [Neon](https://neon.tech) or [Supabase](https://supabase.com).

### 3. Push schema & seed

```bash
npx prisma db push
npx prisma db seed   # optional demo data
```

### 4. Run locally

```bash
npm run dev
# → http://localhost:3000
```

## Deploy to Vercel

1. Push to GitHub
2. Import repo on [vercel.com](https://vercel.com)
3. Add a **Vercel Postgres** database (Storage tab in dashboard)
4. Set `DATABASE_URL` from Vercel Postgres connection string
5. Deploy — Vercel runs `prisma generate` automatically

After deploy, visit `/dashboard` and click **"Load demo data"** to seed.

## API Reference

### Authentication

Sync operations require an agent API key:
```
Authorization: Bearer YOUR_API_KEY
```

Register an agent at `/dashboard/agents` to get a key.

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/memories` | List/search memories |
| POST | `/api/memories` | Create a memory |
| GET | `/api/memories/:id` | Get memory by ID |
| PATCH | `/api/memories/:id` | Update memory |
| DELETE | `/api/memories/:id` | Delete memory |
| GET | `/api/agents` | List agents |
| POST | `/api/agents` | Register agent |
| DELETE | `/api/agents/:id` | Delete agent |
| POST | `/api/sync` | Bulk push memories (auth) |
| GET | `/api/sync` | Pull memories (auth) |
| GET | `/api/graph` | Knowledge graph |
| POST | `/api/graph` | Create relation |
| GET | `/api/dashboard` | Stats |

### Push memories

```bash
curl -X POST https://your-domain.vercel.app/api/sync \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "memories": [
      { "type": "FACT", "content": "User prefers TypeScript" },
      { "type": "GOAL", "content": "Launch product by Q3" }
    ]
  }'
```

### Pull memories

```bash
curl https://your-domain.vercel.app/api/sync \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## Memory Types

| Type | Description | Example |
|------|-------------|---------|
| FACT | Objective facts | "User lives in Bangalore" |
| EVENT | Things that happened | "User deployed Aether" |
| PREFERENCE | Likes and habits | "Prefers dark mode" |
| RELATIONSHIP | Entity connections | "Aether created_by User" |
| CONTEXT | Short-lived context | "Currently fixing auth bug" |
| SKILL | Capabilities | "Proficient in React" |
| GOAL | Intentions | "Launch v1 by Q3" |

## Project Structure

```
aether-protocol/
├── app/
│   ├── api/
│   │   ├── memories/      # CRUD for memories
│   │   ├── agents/        # Agent management
│   │   ├── sync/          # Bulk push/pull (authenticated)
│   │   ├── graph/         # Knowledge graph + relations
│   │   ├── dashboard/     # Stats
│   │   └── seed/          # Demo data
│   ├── dashboard/         # Dashboard UI
│   ├── playground/        # API explorer
│   ├── docs/              # Documentation
│   └── page.tsx           # Landing page
├── lib/
│   ├── prisma.ts          # Database client
│   ├── memory.ts          # Memory utilities
│   └── api.ts             # Response helpers
├── types/                 # TypeScript types
└── prisma/
    └── schema.prisma      # Database schema
```

## License

MIT — build anything on top of Aether.
