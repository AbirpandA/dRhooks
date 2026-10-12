/**
 * Remove notation markers so copied code matches what a reader should paste:
 * marker-only comment lines vanish, trailing markers vanish, and markers that
 * precede prose (`// [!code focus] Explain`) keep the prose.
 */
export const stripNotation = (code: string) =>
  code
    .replace(/^[ \t]*\/\/[ \t]*\[!code [^\]]+\][ \t]*\n/gm, "")
    .replace(/[ \t]*\/\/[ \t]*\[!code [^\]]+\][ \t]*$/gm, "")
    .replace(/\[!code [^\]]+\][ \t]?/g, "");
