import Link from "next/link";
import { ArrowRight, Brain, GaugeCircle, LayoutDashboard, ShieldCheck, Sparkles, UploadCloud, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

const differentiators = [
  {
    title: "Universal PDF Intelligence",
    description:
      "Layout-aware ingestion handles mixed fonts, tables, diagrams, and even scanned booklets with OCR confidence scoring.",
    icon: UploadCloud,
  },
  {
    title: "Authentic ACT Experience",
    description:
      "Timers, tools, accessibility, and navigation that mirror the official ACT testing platform down to the keyboard shortcuts.",
    icon: GaugeCircle,
  },
  {
    title: "Adaptive Coaching Graph",
    description:
      "Every answer updates a mastery model that prescribes targeted drills, explanations, and enrichment resources in real time.",
    icon: Brain,
  },
];

const modes = [
  {
    value: "student",
    label: "Student",
    headline: "Personal mastery journeys",
    copy: "Work through authentic simulations, get instant feedback, and follow adaptive playlists aligned to your goals.",
    bullets: [
      "Smart pacing and confidence tracking",
      "AI co-pilot with retrieval-based explanations",
      "Challenge modes and streak rewards",
    ],
  },
  {
    value: "classroom",
    label: "Classroom",
    headline: "Power tools for teachers",
    copy: "Launch synchronous practice, monitor live progress, and export actionable reports without exposing student data.",
    bullets: [
      "Live proctor dashboard with alerts",
      "Printable ACT-style score reports",
      "Seating charts & small-group recommendations",
    ],
  },
  {
    value: "district",
    label: "District",
    headline: "Impact at scale",
    copy: "Deploy in a weekend on secure infrastructure with open APIs for analytics, curriculum, and SIS interoperability.",
    bullets: [
      "FERPA-ready & locally deployable",
      "OneRoster & Google Classroom export",
      "Equity insights for program leaders",
    ],
  },
];

const stats = [
  { value: "< 5 min", label: "From PDF to simulation" },
  { value: "97%", label: "OCR accuracy on pilot set" },
  { value: "42", label: "Skill areas mapped per learner" },
  { value: "0 trackers", label: "Privacy-first analytics" },
];

export default function HomePage() {
  return (
    <div className="relative isolate overflow-hidden pb-20">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.18),transparent_60%)]" />
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 pb-16 pt-24 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-12">
          <div className="flex-1 space-y-6">
            <Badge variant="outline" className="w-fit gap-2 border-primary/40 text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Congressional App Challenge 2025
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Turn any ACT PDF into an interactive, accessible, adaptive exam lab.
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              Catalyst ingests released booklets, classroom packets, or scanned worksheets and delivers a flawless online simulation with real-time analytics, adaptive remediation, and zero-compromise privacy.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/ingest" className="flex items-center gap-2">
                  Begin Ingestion
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/simulate/sample">Launch Demo Simulation</Link>
              </Button>
            </div>
          </div>
          <Card className="w-full max-w-md border-primary/30 shadow-lg shadow-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-medium uppercase tracking-[0.2em] text-muted-foreground">
                <LayoutDashboard className="h-4 w-4" /> Real-time telemetry
              </CardTitle>
              <CardDescription>
                Live pacing, accuracy pulses, and misconception alerts for every student and section.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-3 text-center text-sm">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-border/60 bg-gradient-to-br from-background to-muted/60 p-4 shadow-sm"
                  >
                    <p className="text-xl font-semibold tracking-tight text-primary">
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="space-y-3 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">Telemetry Feed</p>
                <div className="space-y-2 rounded-lg bg-muted/60 p-3">
                  <p className="flex items-center justify-between text-xs">
                    <span className="font-medium text-foreground">Jordan • Math Q34</span>
                    <span className="text-emerald-500">+28s pacing</span>
                  </p>
                  <p className="text-xs">Flagged for review • Misconception: Systems of equations</p>
                  <p className="text-xs text-muted-foreground">
                    Recommended: Adaptive drill "Linear Combo" • AI explanation generated
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {differentiators.map((item) => (
            <Card key={item.title} className="h-full border-border/70 bg-card/80 shadow-sm">
              <CardHeader>
                <item.icon className="h-10 w-10 rounded-full border border-border/60 bg-muted/60 p-2 text-primary" />
                <CardTitle className="text-xl">{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <Card className="border-primary/30 bg-background/80 shadow-xl">
          <CardContent className="grid gap-8 px-4 py-10 md:grid-cols-[1.1fr_0.9fr] md:px-8">
            <div className="space-y-6">
              <Badge variant="secondary" className="w-fit">
                How it works
              </Badge>
              <h2 className="text-3xl font-semibold tracking-tight">From static PDF to dynamic mastery in four steps.</h2>
              <ol className="space-y-4 text-sm text-muted-foreground">
                <li>
                  <span className="font-semibold text-foreground">1. Upload</span> — Drag & drop any ACT/SAT PDF or use the classroom collection importer.
                </li>
                <li>
                  <span className="font-semibold text-foreground">2. Verify</span> — Review AI-detected structure with confidence heatmaps in the human-in-the-loop editor.
                </li>
                <li>
                  <span className="font-semibold text-foreground">3. Simulate</span> — Launch authentic sections with timers, flagging, scratchpad, and accommodations.
                </li>
                <li>
                  <span className="font-semibold text-foreground">4. Coach</span> — Deliver adaptive recaps, group insights, and shareable reports instantly.
                </li>
              </ol>
              <div className="flex flex-wrap gap-2 text-xs">
                <Badge variant="outline">WCAG 2.2 AA</Badge>
                <Badge variant="outline">Offline-ready</Badge>
                <Badge variant="outline">Open skill taxonomy</Badge>
              </div>
            </div>
            <Tabs defaultValue="student" className="h-full">
              <TabsList className="grid h-auto w-full grid-cols-3">
                {modes.map((mode) => (
                  <TabsTrigger key={mode.value} value={mode.value} className="text-xs">
                    {mode.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              {modes.map((mode) => (
                <TabsContent
                  key={mode.value}
                  value={mode.value}
                  className="mt-4 space-y-3 rounded-2xl border border-border/60 bg-muted/40 p-6 text-sm"
                >
                  <p className="text-sm font-semibold text-foreground">{mode.headline}</p>
                  <p className="text-sm text-muted-foreground">{mode.copy}</p>
                  <ul className="space-y-2 text-sm text-foreground/80">
                    {mode.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </section>

      <section className="mx-auto mt-20 w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[0.7fr_1.3fr]">
          <div className="space-y-4">
            <Badge variant="outline" className="w-fit text-sm">
              Privacy & Accessibility
            </Badge>
            <h2 className="text-3xl font-semibold tracking-tight">Built for public schools by design.</h2>
            <p className="text-base text-muted-foreground">
              Catalyst runs on open infrastructure with transparent data practices. Schools can self-host or use our managed community cloud with no ad tech, no data resale, and no hidden costs.
            </p>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p className="flex items-center gap-2 text-foreground">
                <ShieldCheck className="h-4 w-4 text-emerald-500" /> FERPA-ready, optional login, encrypted storage
              </p>
              <p className="flex items-center gap-2 text-foreground">
                <Users className="h-4 w-4 text-blue-500" /> Group sessions with focus alerts & pause controls
              </p>
              <p className="flex items-center gap-2 text-foreground">
                <Sparkles className="h-4 w-4 text-purple-500" /> Generative supports tuned on open-source solutions
              </p>
            </div>
          </div>

          <Card className="border-border/70 bg-background/80 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Benchmarking the competition</CardTitle>
              <CardDescription>
                Designed to outpace existing prep platforms across fidelity, analytics, and access.
              </CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    <th className="py-3 pr-4 font-medium">Capability</th>
                    <th className="py-3 pr-4 font-medium">Catalyst</th>
                    <th className="py-3 pr-4 font-medium">Official ACT</th>
                    <th className="py-3 pr-4 font-medium">Magoosh</th>
                    <th className="py-3 pr-4 font-medium">UWorld</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/70">
                  {[
                    {
                      capability: "Automated PDF ingestion",
                      catalyst: "✅ Layout-aware ML",
                      act: "Manual uploads",
                      magoosh: "No",
                      uworld: "No",
                    },
                    {
                      capability: "Authentic test interface",
                      catalyst: "✅ Official ACT parity + more",
                      act: "✅",
                      magoosh: "❌",
                      uworld: "❌",
                    },
                    {
                      capability: "Real-time analytics",
                      catalyst: "✅ Live pacing & skill graph",
                      act: "Basic reports",
                      magoosh: "Item stats",
                      uworld: "Post-test only",
                    },
                    {
                      capability: "Teacher & district tools",
                      catalyst: "✅ Free LMS & exports",
                      act: "Paid add-ons",
                      magoosh: "None",
                      uworld: "Limited",
                    },
                    {
                      capability: "Privacy stance",
                      catalyst: "✅ No trackers, self-hostable",
                      act: "Proprietary",
                      magoosh: "3rd-party",
                      uworld: "3rd-party",
                    },
                  ].map((row) => (
                    <tr key={row.capability} className="text-sm text-muted-foreground">
                      <td className="py-3 pr-4 font-medium text-foreground">{row.capability}</td>
                      <td className="py-3 pr-4">{row.catalyst}</td>
                      <td className="py-3 pr-4">{row.act}</td>
                      <td className="py-3 pr-4">{row.magoosh}</td>
                      <td className="py-3 pr-4">{row.uworld}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mx-auto mt-20 w-full max-w-4xl rounded-3xl border border-primary/40 bg-primary text-primary-foreground px-6 py-14 text-center shadow-2xl shadow-primary/40 sm:px-8">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Ready to pilot Catalyst in your community?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base text-primary-foreground/90">
          We&apos;re partnering with Title I schools, libraries, and youth programs to co-design the future of equitable college readiness. Bring your own PDFs and see them transform.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg" variant="secondary" className="text-primary">
            <Link href="/pilot">Request a pilot kit</Link>
          </Button>
          <Button asChild size="lg" variant="ghost" className="border-primary-foreground bg-primary/40 text-primary-foreground">
            <Link href="/docs">View architecture docs</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
