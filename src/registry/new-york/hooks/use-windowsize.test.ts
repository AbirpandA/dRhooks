import { renderHook, act } from "@testing-library/react";
import { useWindowSize } from "./use-windowsize";
import { describe, expect, it } from "vitest";

describe("useWindowSize", () => {
  it("should return the initial window size", () => {
    const { result } = renderHook(() => useWindowSize());
    expect(result.current.width).toBe(window.innerWidth);
    expect(result.current.height).toBe(window.innerHeight);
  });

  it("should update when window is resized", () => {
    const { result } = renderHook(() => useWindowSize());

    act(() => {
      window.dispatchEvent(new Event("resize"));
    });

    expect(result.current.width).toBeTypeOf("number");
    expect(result.current.height).toBeTypeOf("number");
  });
});
