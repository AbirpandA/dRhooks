import { codeToHtml } from "shiki";

import { CopyButton } from "@/components/mdx/copy-button";
import { CODE_THEMES } from "@/lib/mdx";

/** Server-highlighted code block using the same dual themes as MDX fences. */
export async function HighlightedCode({
  code,
  lang = "tsx",
  title,
  bare = false,
}: {
  code: string;
  lang?: string;
  title?: string;
  /** Drop the border and radius when the block sits inside another card. */
  bare?: boolean;
}) {
  const html = await codeToHtml(code.replace(/\n$/, ""), {
    lang,
    themes: CODE_THEMES,
    defaultColor: false,
  });

  return (
    <div
      className={
        bare
          ? "relative"
          : "bg-muted/40 relative overflow-hidden rounded-xl border"
      }
    >
      {title && (
        <div className="text-muted-foreground border-b px-4 py-2 font-mono text-xs">
          {title}
        </div>
      )}
      <div
        className="code-block max-h-[26rem] overflow-auto text-[13px] leading-relaxed [&_pre]:p-4"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <CopyButton
        value={code}
        className={
          title ? "absolute top-1.5 right-2" : "absolute top-3 right-3"
        }
      />
    </div>
  );
}
