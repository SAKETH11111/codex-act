"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Rocket, ShieldCheck, Sparkles } from "lucide-react";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/ingest", label: "Ingest PDF" },
  { href: "/simulate/sample", label: "Simulation" },
  { href: "/analytics", label: "Analytics" },
  { href: "/classrooms", label: "Classrooms" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
              <Sparkles className="h-5 w-5" aria-hidden />
            </span>
            <div className="flex flex-col leading-none">
              <span className="text-base font-semibold">Catalyst</span>
              <span className="text-xs text-muted-foreground">ACT Interactive</span>
            </div>
          </Link>
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <NavigationMenuItem key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "text-sm",
                        isActive
                          ? "bg-primary/10 text-primary hover:bg-primary/20"
                          : "text-muted-foreground",
                      )}
                    >
                      {link.label}
                    </Link>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="hidden md:flex">
            <Link href="/security" className="flex items-center gap-1">
              <ShieldCheck className="h-4 w-4" />
              Security
            </Link>
          </Button>
          <Button asChild size="sm" className="hidden sm:flex">
            <Link href="/simulate/sample" className="flex items-center gap-1">
              <Rocket className="h-4 w-4" />
              Launch Demo
            </Link>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
