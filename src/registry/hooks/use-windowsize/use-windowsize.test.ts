import { renderHook, act } from "@testing-library/react";
import { useWindowSize } from "./use-windowsize";
import { afterEach, describe, expect, it, vi } from "vitest";

const resizeTo = (width: number, height: number) => {
  window.innerWidth = width;
  window.innerHeight = height;
  window.dispatchEvent(new Event("resize"));
};

describe("useWindowSize", () => {
  const original = { width: window.innerWidth, height: window.innerHeight };

  afterEach(() => {
    window.innerWidth = original.width;
    window.innerHeight = original.height;
    vi.restoreAllMocks();
  });

  it("should return the initial window size", () => {
    const { result } = renderHook(() => useWindowSize());
    expect(result.current.width).toBe(window.innerWidth);
    expect(result.current.height).toBe(window.innerHeight);
  });

  it("should update when window is resized", () => {
    const { result } = renderHook(() => useWindowSize());

    act(() => resizeTo(500, 300));

    expect(result.current).toEqual({ width: 500, height: 300 });
  });

  it("should remove its resize listener on unmount", () => {
    const removeSpy = vi.spyOn(window, "removeEventListener");
    const { unmount } = renderHook(() => useWindowSize());

    expect(removeSpy).not.toHaveBeenCalledWith("resize", expect.any(Function));
    unmount();
    expect(removeSpy).toHaveBeenCalledWith("resize", expect.any(Function));
  });
});
