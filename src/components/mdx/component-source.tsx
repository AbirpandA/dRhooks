import { Index } from "@/__registry__";
import { HighlightedCode } from "@/components/mdx/highlighted-code";

/** Shows the source of a registry item. Multi-file items list every file. */
export function ComponentSource({ name }: { name: string }) {
  const files = Index[name]?.files;
  if (!files?.length) {
    return (
      <p className="text-muted-foreground text-sm">
        No source found for <code>{name}</code>.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {files.map((file) => (
        <HighlightedCode
          key={file.path}
          code={file.content}
          title={files.length > 1 ? file.path.split("/").pop() : undefined}
        />
      ))}
    </div>
  );
}
