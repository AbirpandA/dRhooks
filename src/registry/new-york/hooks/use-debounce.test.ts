import { act, renderHook } from "@testing-library/react";
import { useDebounce } from "./use-debounce";
import { vi, it, describe, beforeEach, afterEach, expect } from "vitest";

describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("should return the initial value immediately without delay", () => {
    const { result } = renderHook(() => useDebounce("initial", 300));
    expect(result.current.debounced).toBe("initial");
  });
  it("should update the debounce value after the specified delay", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: "initial", delay: 300 },
      }
    );

    expect(result.current.debounced).toBe("initial");

    rerender({ value: "updated", delay: 300 });

    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current.debounced).toBe("updated");
  });
});
