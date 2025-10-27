import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CalendarDays, KeyRound, PauseCircle, Users } from "lucide-react";

const roster = [
  { name: "Jordan M.", status: "On time", progress: "English Q18", focus: "Flagged x2" },
  { name: "Priya S.", status: "Needs support", progress: "Math Q22", focus: "Pacing slow" },
  { name: "Malik T.", status: "On track", progress: "Reading Q9", focus: "--" },
  { name: "Emilia R.", status: "Paused", progress: "Science Q12", focus: "Teacher pause" },
];

export default function ClassroomsPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2">
          <Badge variant="outline" className="w-fit text-sm">
            Classroom orchestration
          </Badge>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Manage group practice like a proctoring command center.</h1>
          <p className="max-w-3xl text-muted-foreground">
            Launch synced sessions with join codes, monitor learner pacing in real time, and pause or extend sections with a single click. Catalyst keeps privacy-first rosters and exports ready for your LMS.
          </p>
        </div>
        <Button className="gap-2">
          <KeyRound className="h-4 w-4" /> Generate join code
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-border/70">
          <CardHeader className="flex items-center justify-between">
            <div>
              <CardTitle>Session overview</CardTitle>
              <CardDescription>ACT Math • 60 minutes • 24 participants</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Live</Badge>
              <Button variant="outline" size="icon">
                <PauseCircle className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-6 lg:flex-row">
            <div className="flex-1 space-y-4">
              <div className="rounded-2xl border border-border/60 bg-muted/40 p-4">
                <p className="text-sm font-semibold text-foreground">Pacing alerts</p>
                <div className="mt-3 grid gap-2 text-xs text-muted-foreground">
                  <p>3 students are >2 minutes behind pace.</p>
                  <p>1 student flagged calculator policy.</p>
                </div>
              </div>
              <div className="rounded-2xl border border-border/60 bg-muted/40 p-4">
                <p className="text-sm font-semibold text-foreground">Group recommendations</p>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-xs text-muted-foreground">
                  <li>Break into small group for Linear Systems reteach.</li>
                  <li>Assign pacing clinic to 5 students with >65% time usage.</li>
                  <li>Share science explanation video with whole class post-session.</li>
                </ul>
              </div>
            </div>
            <ScrollArea className="h-72 rounded-2xl border border-border/60 bg-muted/30 p-4">
              <div className="space-y-3">
                {roster.map((student) => (
                  <div key={student.name} className="flex items-center justify-between gap-3 rounded-xl border border-border/40 bg-background/80 p-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback>{student.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{student.name}</p>
                        <p className="text-xs text-muted-foreground">{student.progress}</p>
                      </div>
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      <p>{student.status}</p>
                      <p>{student.focus}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>Scheduling & reporting</CardTitle>
            <CardDescription>Build recurring prep blocks with automated reminders and exports.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-muted/30 p-4">
              <CalendarDays className="h-10 w-10 text-primary" />
              <div>
                <p className="font-semibold text-foreground">Blueprint scheduler</p>
                <p>Queue practice sets, schedule adaptive follow-ups, and generate printable proctor packets.</p>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <p className="text-sm font-semibold text-foreground">Modes supported</p>
              <ul className="ml-4 list-disc space-y-1 text-xs">
                <li>Live proctor with optional webcam snapshots (local processing)</li>
                <li>Asynchronous practice with automated reminders</li>
                <li>Community challenge mode with anonymized leaderboard</li>
              </ul>
            </div>
            <Separator />
            <div className="space-y-2">
              <p className="text-sm font-semibold text-foreground">Data safety</p>
              <p>
                Rosters stored locally or on district-managed cloud. No third-party analytics tags. Exports encrypt student identifiers and expire after download.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
