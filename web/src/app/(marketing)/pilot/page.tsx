import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PilotPage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 pb-20 pt-16 sm:px-6 lg:px-8">
      <div className="space-y-3">
        <Badge variant="outline" className="w-fit text-sm">
          Pilot program
        </Badge>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Bring Catalyst to your school or community.</h1>
        <p className="text-base text-muted-foreground">
          We are launching pilots with Title I schools, libraries, and youth organizations. Pilots include training, onboarding, and support for self-hosting or community cloud deployment.
        </p>
      </div>
      <Card className="border-border/70">
        <CardHeader>
          <CardTitle>Pilot package includes</CardTitle>
          <CardDescription>Everything you need to run a test-to-coaching cycle in under a week.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm text-muted-foreground">
          <ul className="list-disc space-y-2 pl-6">
            <li>Automated ingestion pipeline setup with sample ACT & SAT forms</li>
            <li>Teacher dashboard training + accessibility walkthrough</li>
            <li>Data safety checklist and deployment playbook</li>
            <li>Feedback sessions with our product team to shape the roadmap</li>
          </ul>
          <Button className="w-fit">Request pilot kit</Button>
        </CardContent>
      </Card>
    </div>
  );
}
