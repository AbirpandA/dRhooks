import * as React from "react";

/** Numbered steps: `<Steps><Step>...</Step><Step>...</Step></Steps>`. */
export function Steps({ children }: { children: React.ReactNode }) {
  return <div className="[counter-reset:step] my-6">{children}</div>;
}

export function Step({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative [counter-increment:step] border-l pb-6 pl-8 last:border-l-transparent last:pb-0 before:bg-background before:absolute before:top-0 before:-left-4 before:grid before:size-8 before:place-items-center before:rounded-full before:border before:text-sm before:font-medium before:content-[counter(step)] [&>*:first-child]:mt-1">
      {children}
    </div>
  );
}
