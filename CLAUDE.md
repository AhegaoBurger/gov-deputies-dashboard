# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Portuguese Government Deputies Dashboard - a transparency application displaying information about Portuguese parliament deputies. Monorepo with React frontend and Node.js/Hono backend.

## Development Commands

```bash
# Run both frontend and backend concurrently
npm run dev

# Run only backend (with hot reload)
npm run dev:backend

# Run only frontend
npm run dev:frontend

# Build frontend only
npm run build

# Build both backend and frontend
npm run build:all

# Lint frontend
npm run lint --prefix frontend
```

**Ports:** Frontend runs on `localhost:5173`, Backend on `localhost:3001`

## Architecture

### Monorepo Structure
- `/frontend` - React 19 SPA with TanStack Router
- `/backend` - Hono REST API server
- `/data` - Raw JSON data files (portuguese_gov.json, portuguese_gov_2.json)

### Frontend Architecture (`/frontend/src`)

**Feature-based modular structure** - each feature is self-contained:
- `/features/{name}/api/` - API service functions
- `/features/{name}/components/` - Feature-specific React components
- `/features/{name}/pages/` - Page components
- `/features/{name}/types/` - TypeScript interfaces

Features: `deputies`, `analytics`, `positions`, `benefits`, `shareholdings`, `home`

**Routing:** TanStack Router with file-based routing in `/routes`. Route tree is auto-generated - add new routes by creating files in this directory.

**Data fetching pattern:**
- Axios for HTTP requests (`/lib/api-client.ts`)
- React Query for server state management
- Query key factory pattern (e.g., `deputyKeys` object)
- Custom hooks expose queries: `useDeputies`, `useDeputy`, `useFilters`, `useInfiniteDeputies`

**UI Components:** `/components/ui/` contains Radix UI primitives styled with Tailwind and class-variance-authority for variants.

### Backend Architecture (`/backend/src`)

- `/routes/deputies.ts` - All API route handlers
- `/lib/deputies-data.ts` - Data loading and transformation from JSON files

**In-memory data store** - JSON files loaded at startup, no database.

### API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/deputies` | List deputies (supports filtering/pagination) |
| `GET /api/deputies/:id` | Single deputy details |
| `GET /api/filters` | Available filter options |
| `GET /api/analytics/*` | Summary, parties, gender, age, constituencies, professions |
| `GET /api/positions` | Political positions |
| `GET /api/benefits` | Benefits data |
| `GET /api/shareholdings` | Company shareholdings |

## Key Technical Details

- **TypeScript strict mode** enabled across both packages
- **Path alias:** `@/*` maps to `./src/*` in both frontend and backend
- **Styling:** Tailwind CSS 4 with CSS variables for theming (`/frontend/src/styles.css`)
- **Icons:** Lucide React
- **Charts:** Recharts for analytics visualizations
- **CORS:** Backend allows `localhost:5173` and `localhost:3000`
- **No testing framework** currently configured
