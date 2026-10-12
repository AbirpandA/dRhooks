import { describe, expect, it } from "vitest";
import { stripNotation } from "./strip-notation";

describe("stripNotation", () => {
  it("drops marker-only comment lines", () => {
    expect(
      stripNotation("a\n// [!code highlight]\nb\n  // [!code focus]\nc")
    ).toBe("a\nb\nc");
  });

  it("drops trailing markers but keeps the code", () => {
    expect(stripNotation("const a = 1; // [!code ++]\nconst b = 2;")).toBe(
      "const a = 1;\nconst b = 2;"
    );
  });

  it("keeps prose that follows a marker", () => {
    expect(stripNotation("// [!code focus] 1. Initialize\nx();")).toBe(
      "// 1. Initialize\nx();"
    );
    expect(stripNotation("{/* [!code highlight] Refetch */}")).toBe(
      "{/* Refetch */}"
    );
  });

  it("leaves code without markers untouched", () => {
    const code = 'const url = "https://a.b/c"; // plain comment';
    expect(stripNotation(code)).toBe(code);
  });
});
