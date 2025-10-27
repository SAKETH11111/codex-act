# Catalyst Web — ACT Interactive Simulation Platform

Catalyst turns any ACT or SAT practice PDF into a fully interactive, accessible testing experience with real-time analytics and adaptive coaching.

## Quick start

```bash
npm install
npm run dev
```

The UI is available at [http://localhost:3000](http://localhost:3000).

### Major routes
- `/` — marketing landing with differentiators and CAC narrative
- `/ingest` — PDF ingestion + blueprint preview using the Catalyst parser
- `/simulate/sample` — full-screen ACT simulation with timers, flagging, grid-in support
- `/analytics` — real-time analytics dashboard mock
- `/classrooms` — classroom orchestration and proctor tooling preview

## Architecture highlights
- [Next.js](https://nextjs.org/) App Router with TypeScript and Tailwind CSS (v4)
- [shadcn/ui](https://ui.shadcn.com/) component library for accessible design primitives
- `@tanstack/react-query` for client-side mutations
- `next-themes` for light/dark theme support
- `pdf-parse`-powered ingestion API (`/api/ingest`) with heuristics for ACT sectioning, question detection, and answer key alignment

## Project layout
- `src/app/(marketing)` — public marketing pages & docs
- `src/app/(app)` — authenticated-style product surface (ingestion, analytics, classrooms)
- `src/app/simulate/[examId]` — immersive exam runner shell
- `src/components/exam` — simulation components
- `src/lib/act-parser.ts` — PDF parsing + structuring logic
- `src/data/sample-exam.ts` — sample blueprint + analytics data used across the demo
- `src/types/exam.ts` — shared type contracts

## shadcn components
The project is already bootstrapped with shadcn. You can add more components with:

```bash
npx shadcn@latest add component-name
```

## Next steps
- Connect ingestion API to the Python/FastAPI pipeline described in the root README blueprint.
- Persist parsed exams and attempts via a real database.
- Wire real telemetry into the analytics dashboard and classroom roster views.

Built for the 2025 Congressional App Challenge — privacy-first, open, and educator-aligned.
