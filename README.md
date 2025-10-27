# ACT Interactive Simulation Platform — Technical Blueprint

## Vision & Differentiators
- **Mission:** Convert any ACT/SAT practice PDF into a flawless, interactive, accessible, and analytics-driven computer-based testing experience that surpasses commercial leaders (Official ACT Prep, Magoosh, UWorld, Khan Academy, AI tutors).
- **North Star:** Fully automated ingestion + adaptive remediation loop that helps under-resourced schools deliver high-fidelity practice without licensing fees or privacy risks.
- **Key Differentiators:**
  1. **Universal PDF intake** (scanned, mixed-layout, tables, handwriting) with confidence heatmaps and human-in-the-loop corrections under 5 minutes.
  2. **Assessment intelligence graph** that maps every question to ACT skills, time-on-task, and misconception patterns to drive AI-grounded coaching.
  3. **Authentic ACT UX** (timers, navigation, flagging, calculator policies, accessibility) layered with social/classroom modes and proctor dashboards.
  4. **Privacy-by-design:** offline-capable pipeline, auditable storage, zero third-party tracking, FERPA-ready.
  5. **Open, extensible architecture** enabling community contributions (new tests, languages, accommodations).

## Competitive Benchmark
| Capability | Official ACT Online | Magoosh | UWorld | AI Tutors (e.g., Khanmigo) | **Our Platform** |
|------------|-------------------|---------|--------|----------------------------|-------------------|
| PDF ingestion | Manual, limited | None | None | None | **Automated, ML-assisted parsing** |
| Authentic UI | ✅ | ❌ | ❌ | ❌ | **✅ with extra accessibility** |
| Real-time analytics | Limited reporting | Basic | Strong but closed | Conversation-centric | **Full telemetry + adaptive graph** |
| Classroom tools | Paid LMS add-ons | None | Limited | None | **Free proctoring, group runs, exports** |
| Privacy | Proprietary, data shared | Third-party | Third-party | Third-party | **Local-first, no trackers** |
| Personalization | Limited | Video playlists | Drill sets | Chat guidance | **AI skill coach + spaced review** |
| Accessibility | Improving | Minimal | Minimal | Varies | **WCAG 2.2 AA by default** |

## End-to-End Technical Plan

### Phase 0 — Governance & Infrastructure
1. **Repository & DevOps**
   - Monorepo with TurboRepo (frontend + backend + ML services).
   - GitHub Actions for CI, but deployment via self-hosted runners to keep data private.
   - Infrastructure-as-code (Pulumi) for reproducible environments (school districts can self-host on on-prem or secure cloud).
2. **Security**
   - Zero PII by default; user accounts optional (email-less tokens for classrooms).
   - Encryption at rest (PostgreSQL TDE) and in transit (TLS everywhere).
   - Role-based access (students, teachers, admins) handled via Keycloak (self-hosted) or Supabase Auth running on own infra.
3. **Data Storage**
   - Object storage (MinIO/S3-compatible) for PDFs, rendered page images.
   - PostgreSQL for relational data (tests, attempts, analytics rollups).
   - ElasticSearch/OpenSearch for semantic retrieval of questions/concepts.
   - Redis for caching + WebSocket session rooms.

### Phase 1 — PDF Ingestion & Structuring
1. **Upload service** (FastAPI): virus scan -> file hashing -> enqueue processing job.
2. **Pre-processing worker** (Python, Celery):
   - Determine source type: born-digital vs scanned using DPI & text-density heuristics.
   - Use `pikepdf` for decryption removal, page rotation normalization.
   - Convert to images (`pdf2image`) for OCR fallback.
3. **Layout understanding**
   - Run `detectron2` layout model via `layoutparser` to segment headers, paragraphs, tables, figures, answer keys.
   - For handwritten grid-ins, apply `TrOCR` fine-tuned on ACT math responses.
   - Extract tables with `Camelot` (lattice) and `DeepDeSRT` for nested tables (science passages).
4. **Text/OCR**
   - Primary: `PyMuPDF` + `pdfminer.six` for vector text.
   - Fallback OCR: `PaddleOCR` (for accuracy + speed) with custom language pack for math symbols; optionally offline `Tesseract 5`.
   - Confidence scoring aggregated per token; low-confidence spans flagged for human verification UI.
5. **Question segmentation**
   - Heuristics: numbering patterns, ACT section keyword detection, answer choice markers (A-D, F-J), grid-in templates.
   - ML: Fine-tuned `Longformer` sequence tagging to label tokens as QUESTION, CHOICE, ANSWER_KEY, DIRECTIONS, PASSAGE.
   - Combine with rule-based checks to ensure four/five options, capturing diagrams.
   - Associate answer key: detect from end-of-doc tables; align via question IDs; cross-check with bubble patterns.
6. **Structured JSON output** adhering to schema:
   ```json
   {
     "metadata": {"exam_type": "ACT", "version": "2024-05", "source_pdf": "..."},
     "sections": [
       {
         "name": "English",
         "time_limit": 45,
         "passages": [...],
         "questions": [
           {
             "id": "E1-Q1",
             "stem": "...",
             "choices": [{"label": "A", "text": "..."}, ...],
             "answer": "C",
             "skill_tags": ["Grammar::Verb Tense"],
             "resources": {"images": ["/assets/..."], "tables": [...]},
             "difficulty": 0.52,
             "confidence": 0.93
           }
         ]
       }
     ]
   }
   ```
7. **Verification UI**
   - Internal admin React app for quick review: side-by-side PDF pane, detected structure, confidence highlights, one-click corrections.
   - All edits stored as diffs to maintain reproducibility.

### Phase 2 — Core Delivery Platform
1. **Frontend Stack**
   - Next.js 15 (App Router) + TypeScript + Tailwind (or Chakra UI for accessible components).
   - State management: Zustand for local state; React Query for server data.
   - Real-time updates via GraphQL (Hasura/Apollo) or Socket.IO for analytics.
2. **ACT-like Test Runner**
   - Layout replicates ACT online testing (left nav, main content, top timer, flag button).
   - Support for: section selection, instructions, answer palette, review screen.
   - Offline-first (Service Workers) to survive connection drops.
   - Testing harness with Playwright for end-to-end QA.
3. **Accessibility**
   - Semantic HTML with ARIA roles; use Headless UI primitives.
   - Keyboard map mirroring ACT (number keys to select answers, `F` to flag, `Ctrl+Alt+N` next).
   - Screen reader friendly (live regions for timer updates, descriptive alt text from OCR metadata).
   - Color contrast enforcement via design tokens; dyslexia-friendly font option (OpenDyslexic).
   - Adjustable font size, line spacing, high contrast mode.
4. **Assessment features**
   - Timers with pause (teacher-controlled), extended time accommodations (1.5x, 2x, custom).
   - Section locking/unlocking; optional randomized section order for practice.
   - Scratchpad + highlight/annotation (persisted per question).
   - Bubble and grid-in interactions with validation (warn on incomplete grid-in answer formatting).


### Phase 3 — Analytics & Adaptive Engine
1. **Telemetry collection** (frontend): question open time, interactions, changes, flagged status, guessed indicator.
2. **Backend analytics service**
   - Stream events via Kafka (or lightweight NATS) into analytics worker.
   - Real-time composite and sectional scores with ACT scaling tables.
   - Time per question histograms, pace curves overlaying recommended progress.
   - Error classification: compare wrong answer to distractor rationale library; produce concept tags.
3. **Skill graph**
   - Pre-built ACT skill taxonomy (e.g., English > Conventions > Verb Forms).
   - Bayesian Knowledge Tracing to estimate mastery; update after each response.
   - Adaptive recommendations: targeted practice sets, video/reading suggestions (open-source content like CK-12, OER).
4. **Dashboards**
   - Student view: summary, strengths/weaknesses, time management, recommended drills.
   - Teacher/proctor view: class heatmap, flagged struggles, live monitoring during test (question-by-question progress), exportable CSV/PDF.
   - District view: aggregated insights without PII for program evaluation.

### Phase 4 — Collaboration & Proctoring
1. **Classroom Modes**
   - Session creation with join code; teacher controls start/pause.
   - Live leaderboard (optional) for engagement, focusing on accuracy + pacing not competition.
   - Chatless in-test message broadcast for accommodations.
2. **Remote Proctoring (lightweight)**
   - Optional webcam still capture (processed locally, not stored by default) for integrity.
   - Browser focus monitoring; log window switches.
3. **Reporting**
   - Generate printable score reports (PDF via `WeasyPrint`) with ACT-style layout.
   - Export data to CSV, OneRoster, Google Classroom (without storing Google tokens on server—use OAuth device flow with teacher consent and ephemeral tokens).

### Phase 5 — AI Augmentations (Stretch)
1. **AI Tutor Companion**
   - Locally hosted large language model (Llama 3 70B via quantization) fine-tuned on ACT explanations using retrieval from curated solution database.
   - Post-test debrief: interactive conversation referencing student errors, linking to resources.
2. **Challenge Modes**
   - Streak mode: quick drills with adaptive difficulty.
   - "Coach-to-peer" mode: students write explanations; AI rates clarity.
3. **Community Contributions**
   - Open API + Git-based workflow for educators to submit new tests.
   - Plugin marketplace (e.g., translation overlays, audio narration in multiple languages).

## UI / UX Wireframe Sketch (Textual)
```
┌───────────────────────────────────────────────────────────────┐
│ Header: Exam Title | Timer (34:12) | Pause | Accessibility 🔽 │
├───────────────┬───────────────────────────────────────────────┤
│ Section Nav    │ Main Content                                   │
│ [English]✔     │ Passage tabs (if applicable)                   │
│ [Math]         │ ------------------------------------------------│
│ [Reading]      │ Question stem (with image/table)               │
│ [Science]      │ Choices: radio buttons A–D / grid-in keypad    │
│ Review Screen  │ ------------------------------------------------│
│ Calculator ✅   │ Notes / Highlights / Flag button / Confidence  │
│ Accommodations │ Navigation: Prev | Next | Mark for Review      │
├───────────────┴───────────────────────────────────────────────┤
│ Footer: Status palette (Answered, Unanswered, Flagged, Timed)   │
└───────────────────────────────────────────────────────────────┘
```
**Analytics Dashboard Sketch**
```
┌───────────────────────────────────────────────────────────────┐
│ Student: Jordan | Composite: 31 | Goal: 32                     │
├──────────────┬────────────────────────────────────────────────┤
│ Section Card │ Pace vs Time chart (line)                       │
│ English: 32  │ Accuracy heatmap by skill                       │
│ Math: 29     │ Error breakdown (Misread, Concept, Careless)    │
│ Reading: 31  │ Recommendations list with launch buttons        │
│ Science: 30  │                                                 │
├──────────────┴────────────────────────────────────────────────┤
│ Timeline of attempts | Export | Share to teacher | Start drill │
└───────────────────────────────────────────────────────────────┘
```

## Feature Matrix

### Core (MVP)
- Automated PDF ingestion & question structuring (English, Math, Reading, Science).
- ACT-mirroring test runner with timers, flagging, navigation, answer review.
- MCQ + grid-in handling, including keyboard input.
- Instant scoring with ACT scaling tables, analytics per section.
- Teacher session management, live progress dashboard.
- Accessibility compliance (WCAG 2.2 AA baseline).
- Exportable reports (PDF, CSV), FERPA-compliant data handling.

### Advanced (Post-MVP)
- Skill graph mastery tracking + adaptive recommendations.
- Student/teacher portals with historical analytics.
- Offline/low-bandwidth mode with sync-on-connect.
- Multilingual UI + translation overlays.
- In-test accommodations: text-to-speech, color overlays, extended time presets.
- API + CLI for batch importing test PDFs.

### Stretch / Bonus Ideas
- AI tutor with retrieval-based feedback and voice interface.
- Gamified challenge ladders, community leaderboard (opt-in, anonymized).
- Parent/mentor view with actionable guidance.
- Local-first progressive web app deployable on school intranets.
- Integration with open-data college planning tools (score->scholarship insights).

## Data Safety & Privacy Strategy
- **Minimal data principle:** store only anonymized attempt IDs; personal info optional and encrypted.
- **Local processing:** all OCR/ML runs on school-managed servers or district cloud; no SaaS dependency.
- **Open-source stack:** transparency for audits; reproducible builds.
- **Compliance:** FERPA best practices, COPPA (for under-13) via parental consent flows, SOC2-ready controls for hosting partners.
- **Observability:** audit logs for data access, automated alerts for anomalies.

## Potential Obstacles & Mitigations
| Challenge | Mitigation |
|-----------|------------|
| **Noisy scanned PDFs** | Advanced pre-processing (deskew, denoise), dual OCR engines, manual correction UI with confidence scoring. |
| **Complex layouts (split columns, science data)** | LayoutParser + custom-trained DETR model on ACT-specific dataset; fallback manual tagging. |
| **Answer key misalignment** | Heuristic cross-check (choice count, pattern matching), fuzzy matching, human validation for <95% confidence. |
| **Time to ingest new exams** | Asynchronous worker cluster with GPU support; queue monitoring; incremental saving so partial results available quickly. |
| **Accessibility regressions** | Automated axe-core tests, manual screen reader QA, accessibility champion from design team. |
| **Data privacy concerns from districts** | Provide deployment cookbook (Docker Compose, Kubernetes Helm), offline bundle, independent security audit. |
| **Judge skepticism ("too ambitious")** | Live demo with real PDF ingestion during presentation; share benchmarks vs incumbents; highlight open-source community partners. |

## Innovation Highlights (Why CAC Judges Will Notice)
- Live "ingest-to-test" demo showcasing automation unseen in other tools.
- ACT skill graph visualizations that adapt drills instantly, bridging analytics + action.
- Accessibility-first design including sign-language avatar support (stretch via WebGL overlay) and dyslexia-friendly modes.
- AI coach that respects privacy (runs on-device server) vs cloud LLMs.
- Collaborative proctor dashboard enabling community competitions or district-wide practice days.

## Pilot & Impact Strategy
- **Initial pilot:** partner with Title I high schools (e.g., Chicago Public Schools, rural Tennessee) via nonprofit networks (College Possible, Gear Up).
- **Community deployment:** host on state library or community college servers; run weekend bootcamps.
- **College advising ties:** integrate analytics into counselor meetings; provide actionable next steps.
- **Teacher training:** micro-credential course on using ingestion + analytics; empower them to create custom mini-tests.
- **Feedback loop:** recruit student advisory board to iterate on UI/accessibility.

## Development Roadmap (Indicative)
1. **Month 1–2:** Build ingestion MVP, question schema, admin verification tool.
2. **Month 3–4:** Implement ACT runner, timers, analytics foundation, teacher dashboards.
3. **Month 5:** Accessibility audits, offline mode, classroom orchestration.
4. **Month 6:** Adaptive engine, AI coach prototype, finalize CAC submission with live demo + documentation.

## Tech Stack Summary
- **Backend:** FastAPI, Celery, PostgreSQL, Redis, MinIO, Kafka/NATS (events), ElasticSearch.
- **ML/OCR:** PyMuPDF, pdfminer.six, PaddleOCR, Tesseract, layoutparser + Detectron2, Camelot/DeepDeSRT, HuggingFace Transformers (Longformer, TrOCR).
- **Frontend:** Next.js + TypeScript, Tailwind/Chakra, Zustand, React Query, Recharts, Playwright, axe-core.
- **Infrastructure:** Docker/Kubernetes, Pulumi, Traefik for routing, SSO via Keycloak, logging with OpenTelemetry + Grafana stack.
- **CI/CD:** GitHub Actions (self-hosted), unit + integration tests, regression suite with fixture PDFs.

## Next Steps for Team
1. Spin up prototype ingestion pipeline with sample PDFs; log accuracy metrics.
2. Design high-fidelity Figma mocks aligned with textual wireframes.
3. Begin building modular components (PassageViewer, AnswerPalette, TimerController).
4. Engage pilot schools for feedback; gather accessibility requirements early.
5. Document architecture and contribution guidelines to rally open-source collaborators.

> **Outcome:** A transformative, open, privacy-preserving ACT/SAT practice platform that automates content ingestion, mirrors official testing, and drives personalized growth—setting a new bar for CAC 2025 and beyond.
