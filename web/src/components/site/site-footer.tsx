import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const footerLinks = [
  { label: "Accessibility", href: "/accessibility" },
  { label: "Privacy", href: "/privacy" },
  { label: "Open Source", href: "https://github.com/" },
  { label: "Pilot", href: "/pilot" },
];

export function SiteFooter() {
  return (
    <footer className="border-t bg-background/50">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-muted-foreground">
              Catalyst • Open ACT Practice Intelligence
            </p>
            <p className="text-sm text-muted-foreground/80">
              Built for public schools, community programs, and ambitious learners everywhere.
            </p>
          </div>
          <nav className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="rounded-full px-3 py-1 transition hover:bg-accent hover:text-accent-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <Separator className="my-6" />
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Catalyst Collective. Licensed for educational use under CC BY-NC-SA.
        </p>
      </div>
    </footer>
  );
}
