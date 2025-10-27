import { sampleAnalytics, sampleExam } from "@/data/sample-exam";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Download, LineChart } from "lucide-react";

export default function AnalyticsPage() {
  const analytics = sampleAnalytics;
  const exam = sampleExam;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2">
          <Badge variant="outline" className="w-fit text-sm">
            Real-time analytics
          </Badge>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Performance intelligence across every section.</h1>
          <p className="max-w-2xl text-muted-foreground">
            Monitor pacing, accuracy, and skill mastery moments after an attempt finishes. Export reports, surface misconceptions, and push targeted practice directly to learners or groups.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" /> Export CSV
          </Button>
          <Button className="gap-2">
            <LineChart className="h-4 w-4" /> Live Monitor
          </Button>
        </div>
      </div>

      <Card className="border-border/70">
        <CardHeader className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <CardTitle className="text-2xl">Attempt snapshot</CardTitle>
            <CardDescription>
              {exam.title} • Composite {analytics.compositeScore} • Attempt ID {analytics.attemptId}
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">ACT</Badge>
            <Badge variant="secondary">Mode: Simulation</Badge>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4 rounded-2xl border border-border/60 bg-muted/40 p-5">
            <p className="text-sm font-semibold text-foreground">Composite pacing & accuracy</p>
            <div className="space-y-3 text-sm">
              {analytics.sections.map((section) => {
                const examSection = exam.sections.find((item) => item.id === section.sectionId);
                const label = examSection?.name ?? section.sectionId;
                const pacePercent = Math.min(
                  Math.round((section.timePerQuestionSeconds / 60) * 100) / 100,
                  2,
                );
                return (
                  <div key={section.sectionId}>
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span>{label}</span>
                      <span>{Math.round(section.accuracy * 100)}% accuracy</span>
                    </div>
                    <Progress value={section.accuracy * 100} className="mt-1 h-2" />
                    <p className="mt-1 text-xs text-muted-foreground">
                      Avg. time {Math.round(section.timePerQuestionSeconds)}s per item • Pace factor {pacePercent.toFixed(2)}x
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-3 rounded-2xl border border-border/60 bg-muted/40 p-5 text-sm">
            <p className="text-sm font-semibold text-foreground">Recommended actions</p>
            <ul className="space-y-3">
              {analytics.recommendedNextActions.map((item) => (
                <li key={item.label} className="rounded-xl border border-border/50 bg-background/80 p-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                    {item.href && (
                      <Button asChild size="icon" variant="ghost" className="h-9 w-9">
                        <a href={item.href}>
                          <ArrowUpRight className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/70">
        <CardHeader>
          <CardTitle>Section detail</CardTitle>
          <CardDescription>Compare accuracy, timing, and flagged questions at a glance.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Section</TableHead>
                <TableHead>Accuracy</TableHead>
                <TableHead>Scaled score</TableHead>
                <TableHead>Avg. time</TableHead>
                <TableHead>Focus skills</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analytics.sections.map((section) => {
                const examSection = exam.sections.find((item) => item.id === section.sectionId);
                return (
                  <TableRow key={section.sectionId}>
                    <TableCell>{examSection?.name ?? section.sectionId}</TableCell>
                    <TableCell>{Math.round(section.accuracy * 100)}%</TableCell>
                    <TableCell>{section.scoreScaled ?? "—"}</TableCell>
                    <TableCell>{Math.round(section.timePerQuestionSeconds)}s</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        {section.focusSkills.map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="border-border/70">
        <CardHeader>
          <CardTitle>Longitudinal mastery</CardTitle>
          <CardDescription>
            Sparkline trends for accuracy vs pacing by skill families. Data syncs instantly after every attempt.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>
            Catalyst maintains a knowledge graph of 42 ACT skill families. Every response updates student mastery, surfaces misconceptions, and powers adaptive review sets. Export mastery data to your LMS or SIS via OneRoster-compatible files.
          </p>
          <Separator />
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-border/60 bg-muted/40 p-4">
              <p className="text-sm font-semibold text-foreground">English • Verb Tense</p>
              <p className="mt-2 text-3xl font-bold text-foreground">78%</p>
              <p className="text-xs text-muted-foreground">▲ 8 pts vs last attempt</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-muted/40 p-4">
              <p className="text-sm font-semibold text-foreground">Math • Systems</p>
              <p className="mt-2 text-3xl font-bold text-foreground">64%</p>
              <p className="text-xs text-muted-foreground">▼ 4 pts vs last attempt</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-muted/40 p-4">
              <p className="text-sm font-semibold text-foreground">Science • Data Analysis</p>
              <p className="mt-2 text-3xl font-bold text-foreground">81%</p>
              <p className="text-xs text-muted-foreground">▲ 5 pts vs last attempt</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
