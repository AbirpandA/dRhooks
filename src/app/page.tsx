import { Code2, Github, Zap } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

      <header className="sticky top-0 z-50 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-neutral-950/60">
        <div className="container mx-auto flex h-14 max-w-screen-2xl items-center px-4 sm:px-8">
          <div className="mr-4 flex items-center space-x-2">
            <Code2 className="h-6 w-6" />
            <span className="font-bold text-xl">drhooks</span>
          </div>

          <nav className="flex flex-1 items-center justify-end space-x-6">
            <Link
              href="/docs"
              className="text-sm font-medium text-neutral-600 dark:text-neutral-400 transition-colors hover:text-neutral-900 dark:hover:text-neutral-100"
            >
              Docs
            </Link>
            <Link
              href="/docs/components/bounce_button"
              className="text-sm font-medium text-neutral-600 dark:text-neutral-400 transition-colors hover:text-neutral-900 dark:hover:text-neutral-100"
            >
              Components
            </Link>
            <Link
              href="/docs/hooks/use-debounce"
              className="text-sm font-medium text-neutral-600 dark:text-neutral-400 transition-colors hover:text-neutral-900 dark:hover:text-neutral-100"
            >
              Hooks
            </Link>
            <Link
              href="https://github.com/AbirpandA/dRhooks"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 dark:focus-visible:ring-neutral-300 disabled:pointer-events-none disabled:opacity-50 h-9 w-9"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>
          </nav>
        </div>
      </header>

      <main className="relative">
        <section className="container mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-screen-2xl flex-col items-center justify-center px-4 sm:px-8 py-24">
          <div className="mx-auto flex max-w-[980px] flex-col items-center gap-6 text-center">
            <div className="inline-flex items-center rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm">
              <Zap className="mr-2 h-3 w-3" />
              <span className="text-neutral-600 dark:text-neutral-400">
                Ship faster with pre-built hooks
              </span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              A collection of reusable{" "}
              <span className="bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-neutral-100 dark:to-neutral-400 bg-clip-text text-transparent">
                React hooks
              </span>
            </h1>

            <p className="max-w-[700px] text-lg text-neutral-600 dark:text-neutral-400 sm:text-xl">
              Production-ready hooks and components. Copy, paste, and customize.
              Open source and free to use.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
              <Link
                href="/docs"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 dark:focus-visible:ring-neutral-300 disabled:pointer-events-none disabled:opacity-50 bg-neutral-900 dark:bg-neutral-50 text-neutral-50 dark:text-neutral-900 hover:bg-neutral-900/90 dark:hover:bg-neutral-50/90 h-11 px-8"
              >
                Explore the docs
              </Link>
              <Link
                href="https://github.com/AbirpandA/dRhooks"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 dark:focus-visible:ring-neutral-300 disabled:pointer-events-none disabled:opacity-50 border border-neutral-200 dark:border-neutral-800 bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 h-11 px-8"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="mr-2 h-4 w-4" />
                View on GitHub
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-neutral-200 dark:border-neutral-800 py-6">
        <div className="container mx-auto max-w-screen-2xl px-4 sm:px-8 flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Built for developers who value speed and simplicity.
          </p>
          <div className="flex items-center space-x-4">
            <Link
              href="https://github.com/AbirpandA/dRhooks"
              className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </Link>
            <Link
              href="/docs"
              className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            >
              Docs
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
