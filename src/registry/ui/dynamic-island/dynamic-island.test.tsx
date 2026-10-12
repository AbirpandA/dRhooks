import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  DynamicIsland,
  Island,
  IslandProvider,
  islandVariants,
  useIsland,
  type IslandOptions,
} from "./dynamic-island";

function Harness({ options }: { options: IslandOptions }) {
  const island = useIsland();
  return (
    <>
      <button onClick={() => island.show(options)}>show</button>
      <button onClick={() => island.update({ title: "Updated" })}>
        update
      </button>
      <button onClick={island.dismiss}>dismiss</button>
      <button
        onClick={() =>
          island
            .promise(Promise.reject(new Error("x")), {
              loading: "Working",
              success: "Done",
              error: "Broken",
            })
            .catch(() => {})
        }
      >
        promise
      </button>
    </>
  );
}

function setup(options: IslandOptions) {
  render(
    <IslandProvider>
      <DynamicIsland />
      <Harness options={options} />
    </IslandProvider>
  );
}

const root = () => document.querySelector("[data-slot='root']") as HTMLElement;
const press = (name: string) =>
  act(() => {
    fireEvent.click(screen.getByText(name));
  });

describe("DynamicIsland", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("is closed until something is shown", () => {
    setup({ title: "Hi" });
    expect(root()).toHaveAttribute("data-state", "closed");
    press("show");
    expect(root()).toHaveAttribute("data-state", "open");
    expect(screen.getByText("Hi")).toBeInTheDocument();
  });

  it("uses an assertive alert for errors and a polite status otherwise", () => {
    setup({ title: "Oops", variant: "error" });
    press("show");
    expect(root()).toHaveAttribute("role", "alert");
    expect(root()).toHaveAttribute("aria-live", "assertive");
  });

  it("applies variant classes and data attributes", () => {
    setup({ title: "Saved", variant: "success" });
    press("show");
    expect(root()).toHaveAttribute("data-variant", "success");
    expect(root().className).toContain("bg-emerald-950");
    expect(islandVariants({ variant: "error", size: "expanded" })).toContain(
      "w-80"
    );
  });

  it("auto-dismisses after the duration", () => {
    setup({ title: "Bye", duration: 1000 });
    press("show");
    act(() => {
      vi.advanceTimersByTime(999);
    });
    expect(root()).toHaveAttribute("data-state", "open");
    act(() => {
      vi.advanceTimersByTime(2);
    });
    expect(root()).toHaveAttribute("data-state", "closed");
  });

  it("pauses the timer while hovered", () => {
    setup({ title: "Hold", duration: 1000 });
    press("show");
    act(() => {
      fireEvent.pointerEnter(root());
    });
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(root()).toHaveAttribute("data-state", "open");
    act(() => {
      fireEvent.pointerLeave(root());
    });
    act(() => {
      vi.advanceTimersByTime(1001);
    });
    expect(root()).toHaveAttribute("data-state", "closed");
  });

  it("morphs when updated", () => {
    setup({ title: "Before" });
    press("show");
    press("update");
    expect(screen.getByText("Updated")).toBeInTheDocument();
  });

  it("expands content from the header and collapses on Escape", () => {
    setup({ title: "Player", content: <p>Details</p> });
    press("show");
    const toggle = screen.getByRole("button", { name: "Player" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    act(() => {
      fireEvent.click(toggle);
    });
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(root()).toHaveAttribute("data-size", "expanded");
    act(() => {
      fireEvent.keyDown(window, { key: "Escape" });
    });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("runs loading to error through promise()", async () => {
    setup({ title: "x" });
    press("promise");
    expect(screen.getByText("Working")).toBeInTheDocument();
    await act(async () => {
      await Promise.resolve();
    });
    expect(screen.getByText("Broken")).toBeInTheDocument();
    expect(root()).toHaveAttribute("data-variant", "error");
  });

  it("throws when useIsland is used without a provider", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Harness options={{ title: "x" }} />)).toThrow(
      "useIsland must be used inside <IslandProvider>"
    );
    error.mockRestore();
  });
});

describe("Island primitives", () => {
  it("are unstyled and support asChild", () => {
    render(
      <Island.Root variant="info">
        <Island.Title asChild>
          <h2>Heading</h2>
        </Island.Title>
      </Island.Root>
    );
    const heading = screen.getByRole("heading", { name: "Heading" });
    expect(heading).toHaveAttribute("data-slot", "title");
    expect(root()).not.toHaveAttribute("class");
  });
});
