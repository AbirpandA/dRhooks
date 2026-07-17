import { render } from "@testing-library/react";
import { LoadingSwap } from "./loading-swap";
import { describe, it, expect } from "vitest";
import React from "react";

describe("LoadingSwap", () => {
  it("shows children when not loading", () => {
    const { container } = render(
      <LoadingSwap isLoading={false}>
        <div>Content</div>
      </LoadingSwap>
    );
    const visibleDiv = container.querySelector(".visible");
    expect(visibleDiv).toHaveTextContent("Content");
  });

  it("shows loader when loading", () => {
    const { container } = render(
      <LoadingSwap isLoading={true}>
        <div>Content</div>
      </LoadingSwap>
    );
    const loader = container.querySelector(".animate-spin");
    expect(loader).toBeInTheDocument();
    const visibleDiv = container.querySelector(".visible");
    expect(visibleDiv?.querySelector(".animate-spin")).toBeInTheDocument();
  });
});
