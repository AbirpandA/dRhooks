import { render, screen } from "@testing-library/react";
import Bouncebutton from "./bounce-button";
import { describe, it, expect } from "vitest";
import React from "react";

describe("Bouncebutton", () => {
  it("renders correctly with children", () => {
    render(<Bouncebutton>Click me</Bouncebutton>);
    const button = screen.getByRole("button", { name: "Click me" });
    expect(button).toBeInTheDocument();
    expect(button.className).toContain("hover:-translate-y-0.5");
  });
});
