import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PromptInput } from "./prompt-input";
import { describe, it, expect, vi } from "vitest";
import React from "react";

describe("PromptInput", () => {
  it("renders correctly and allows typing", async () => {
    const user = userEvent.setup();
    const onsubmit = vi.fn();
    render(<PromptInput onsubmit={onsubmit} loading={false} />);

    const textarea = screen.getByPlaceholderText("what do you wanna build");
    expect(textarea).toBeInTheDocument();

    await user.type(textarea, "Hello World");
    expect(textarea.tagName).toBe("TEXTAREA");
    expect((textarea as HTMLTextAreaElement).value).toBe("Hello World");
  });

  it("submits the form when submit button is clicked", async () => {
    const user = userEvent.setup();
    const onsubmit = vi.fn();
    render(<PromptInput onsubmit={onsubmit} loading={false} />);

    const textarea = screen.getByPlaceholderText("what do you wanna build");
    await user.type(textarea, "Hello World");

    const submitBtn = screen.getByRole("button", { name: "Submit message" });
    await user.click(submitBtn);

    expect(onsubmit).toHaveBeenCalledWith("Hello World");
  });

  it("submits the form when Enter is pressed without shift", async () => {
    const user = userEvent.setup();
    const onsubmit = vi.fn();
    render(<PromptInput onsubmit={onsubmit} loading={false} />);

    const textarea = screen.getByPlaceholderText("what do you wanna build");
    await user.type(textarea, "Hello World{enter}");

    expect(onsubmit).toHaveBeenCalledWith("Hello World");
  });
});
