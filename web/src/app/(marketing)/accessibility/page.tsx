const commitments = [
  "WCAG 2.2 AA compliance audited with automated and manual testing",
  "Keyboard-first navigation with configurable shortcuts mirroring ACT platform",
  "Screen reader friendly components, live regions for timers, and descriptive alt text",
  "Multi-modal supports including dyslexia-friendly fonts, high contrast, and text-to-speech",
];

export default function AccessibilityPage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 pb-20 pt-16 sm:px-6 lg:px-8">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Accessibility</p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Inclusive by default.</h1>
        <p className="text-base text-muted-foreground">
          Catalyst is built with accessible design tokens, semantic HTML, and thorough screen reader testing. We partner with students who learn differently to co-create features.
        </p>
      </div>
      <ul className="space-y-3 text-sm text-muted-foreground">
        {commitments.map((item) => (
          <li key={item} className="rounded-2xl border border-border/60 bg-muted/30 p-4">
            {item}
          </li>
        ))}
      </ul>
      <p className="text-sm text-muted-foreground">
        Need accommodations documentation or to report a barrier? Email access@catalyst.app and we will respond within 48 hours.
      </p>
    </div>
  );
}
