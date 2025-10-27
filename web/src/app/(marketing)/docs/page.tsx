const sections = [
  {
    title: "Architecture overview",
    description: "Monorepo with Next.js frontend, FastAPI ingestion services, Celery workers, and PostgreSQL/MinIO storage.",
  },
  {
    title: "Deployment recipes",
    description: "Docker Compose for quick trials, Kubernetes Helm charts for districts, and offline appliance guides.",
  },
  {
    title: "Extensibility",
    description: "Plugin hooks for new skill taxonomies, translation overlays, and AI tutor models.",
  },
];

export default function DocsPage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 pb-20 pt-16 sm:px-6 lg:px-8">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Documentation hub</p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Developer-friendly and educator-approved.</h1>
        <p className="text-base text-muted-foreground">
          Full documentation is in progress. Below is a preview of what we&apos;re publishing for partners and contributors.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {sections.map((section) => (
          <div key={section.title} className="rounded-2xl border border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground">
            <p className="text-sm font-semibold text-foreground">{section.title}</p>
            <p className="mt-2 text-xs">{section.description}</p>
          </div>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">Looking to contribute? Join our GitHub discussions — repo access is granted to public educators and open-source collaborators.</p>
    </div>
  );
}
