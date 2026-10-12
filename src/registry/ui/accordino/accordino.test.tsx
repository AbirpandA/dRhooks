import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "./accordino";
import { describe, it, expect } from "vitest";
import React from "react";

describe("Accordion", () => {
  it("renders and toggles content", async () => {
    const user = userEvent.setup();
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Is it accessible?</AccordionTrigger>
          <AccordionContent>
            Yes. It adheres to the WAI-ARIA design pattern.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const trigger = screen.getByText("Is it accessible?");
    expect(trigger).toBeInTheDocument();
    expect(trigger.getAttribute("data-state")).toBe("closed");

    await user.click(trigger);

    expect(trigger.getAttribute("data-state")).toBe("open");
    const content = screen.getByText(
      "Yes. It adheres to the WAI-ARIA design pattern."
    );
    expect(content).toBeInTheDocument();
  });
});
