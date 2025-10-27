const commitments = [
  {
    title: "Minimal data collection",
    description: "We only store responses, timing, and educator-configured metadata. Personal identifiers are optional and encrypted at rest.",
  },
  {
    title: "Transparent retention",
    description: "District admins control retention windows (default 18 months). Automated purges keep storage lean.",
  },
  {
    title: "Accessible exports",
    description: "Students can download or delete their data anytime. Educators receive machine-readable exports for audits.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 pb-20 pt-16 sm:px-6 lg:px-8">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Privacy statement</p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Your data. Your control.</h1>
        <p className="text-base text-muted-foreground">
          Catalyst never sells or advertises with learner data. Our open-source stack is auditable, and districts can self-host for complete control.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {commitments.map((item) => (
          <div key={item.title} className="rounded-2xl border border-border/60 bg-muted/30 p-4">
            <p className="text-sm font-semibold text-foreground">{item.title}</p>
            <p className="mt-2 text-xs text-muted-foreground">{item.description}</p>
          </div>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">
        Full privacy policy coming soon. Contact privacy@catalyst.app for DPA templates or localized compliance documentation.
      </p>
    </div>
  );
}
