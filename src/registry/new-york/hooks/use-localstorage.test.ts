import { renderHook, act } from "@testing-library/react";
import { useLocalStorage } from "./use-localstorage";
import { describe, it, expect, beforeEach } from "vitest";

describe("useLocalStorage", () => {
  let store: Record<string, string> = {};

  beforeEach(() => {
    store = {};
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
          store[key] = value.toString();
        },
        removeItem: (key: string) => {
          delete store[key];
        },
        clear: () => {
          store = {};
        },
      },
      writable: true,
    });
    window.localStorage.clear();
  });

  it("should return the initial value if localStorage is empty", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "initial"));
    expect(result.current[0]).toBe("initial");
  });

  it("should return the stored value if it exists in localStorage", () => {
    window.localStorage.setItem("test-key", JSON.stringify("stored-value"));
    const { result } = renderHook(() => useLocalStorage("test-key", "initial"));
    expect(result.current[0]).toBe("stored-value");
  });

  it("should update localStorage when the value changes", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "initial"));

    act(() => {
      result.current[1]("new-value");
    });

    expect(result.current[0]).toBe("new-value");
    expect(window.localStorage.getItem("test-key")).toBe(
      JSON.stringify("new-value")
    );
  });
});
