import React from "react";
import { PromptInput } from "../ui/prompt-input";

 const PromptInputExample = () => {
  async function handleSubmit(value: string, files?: File[]) {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        console.log("Submitted value:", value);
        if (files) {
          console.log("With files:", files);
        }
        resolve();
      }, 2000);
    });
  }

  

  function handleError(error: Error) {
    console.error("Error during submission:", error);
  }

  return (
    <div className="">

      <PromptInput
        onsubmit={handleSubmit}
        onError={handleError}
        allowFiles={true}
        loading={false}
        placeholder="Type your prompt here..."
        maxLength={3000}
        
      />
    </div>

  );
}

export default PromptInputExample