import * as React from "react";

/**
 * The surface every live example sits on: one consistent padding, a subtle
 * dotted background, and a centred column with a fixed maximum width so
 * `w-full` examples and intrinsic-width examples both look right.
 */
export function PreviewCanvas({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-60 items-center justify-center px-6 py-12 sm:px-10">
      <div
        aria-hidden
        className="absolute inset-0 [background-image:radial-gradient(var(--border)_1px,transparent_1px)] [background-size:18px_18px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]"
      />
      <div className="relative flex w-full max-w-md flex-col items-center justify-center gap-4">
        {children}
      </div>
    </div>
  );
}
