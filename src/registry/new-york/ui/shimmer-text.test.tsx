import { render, screen } from "@testing-library/react";
import { ShimmerText } from "./shimmer-text";
import { describe, it, expect } from "vitest";
import React from "react";

describe("ShimmerText", () => {
  it("renders correctly", () => {
    render(<ShimmerText>Shimmering</ShimmerText>);
    const text = screen.getByText("Shimmering");
    expect(text).toBeInTheDocument();
    expect(text.className).toContain("bg-clip-text");
  });
});
