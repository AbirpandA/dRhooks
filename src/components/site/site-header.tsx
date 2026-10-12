import Link from "next/link";
import { Github } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/site/logo";
import { MobileNav } from "@/components/site/mobile-nav";
import { Search } from "@/components/site/search";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { getNav, siteConfig } from "@/lib/docs";

export function SiteHeader({
  showMobileNav = false,
}: {
  showMobileNav?: boolean;
}) {
  const groups = getNav();

  return (
    <header className="bg-background/80 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 w-full border-b backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[1400px] items-center gap-2 px-4 sm:px-6">
        {showMobileNav && <MobileNav groups={groups} />}
        <Logo className="mr-4" />
        <nav className="text-muted-foreground hidden items-center gap-5 text-sm md:flex">
          <Link
            href="/docs"
            className="hover:text-foreground transition-colors"
          >
            Docs
          </Link>
          <Link
            href="/docs/hooks"
            className="hover:text-foreground transition-colors"
          >
            Hooks
          </Link>
          <Link
            href="/docs/components"
            className="hover:text-foreground transition-colors"
          >
            Components
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-1">
          <Search groups={groups} />
          <Button variant="ghost" size="icon" asChild>
            <Link
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <Github className="size-4" />
            </Link>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
