export default function SecurityPage() {
  const highlights = [
    "Self-hostable infrastructure with encrypted object storage and PostgreSQL", 
    "No tracking pixels, cookies, or third-party analytics by default",
    "Student accounts optional — anonymous tokens for classroom sessions",
    "Comprehensive audit logging and access controls for proctors and admins",
  ];

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 pb-20 pt-16 sm:px-6 lg:px-8">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Security & privacy</p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Privacy-first by design.</h1>
        <p className="text-base text-muted-foreground">
          Catalyst honors FERPA, COPPA, and district-level data agreements. Every feature is evaluated through a privacy impact assessment before shipping.
        </p>
      </div>
      <ul className="space-y-4 text-sm text-muted-foreground">
        {highlights.map((item) => (
          <li key={item} className="rounded-2xl border border-border/60 bg-muted/30 p-4">
            {item}
          </li>
        ))}
      </ul>
      <p className="text-sm text-muted-foreground">
        Need a full security packet? Email security@catalyst.app for our threat model, vendor questionnaires, and deployment hardening guide.
      </p>
    </div>
  );
}
