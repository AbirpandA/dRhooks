import React from "react";
import { ArrowUp, Paperclip, X } from "lucide-react";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { cn } from "@/lib/utils";

interface PromptInputProps {
  onsubmit: (value: string, files?: File[]) => Promise<void> | void;
  onchange?: (value: string) => void;
  onError?: (error: Error) => void;
  allowFiles?: boolean;
  acceptedTypes?: string;
  loading: boolean;
  maxfiles?: number;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
  minLength?: number;
  id?: string;
  "aria-label"?: string;
}

export function PromptInput({
  onsubmit,
  onchange,
  onError,
  loading,
  allowFiles = false,
  acceptedTypes = 'image/*,.pdf,.doc,.docx',
  maxfiles = 4,
  placeholder = "what do you wanna build",
  className,
  disabled = false,
  maxLength,
  minLength,
  id,
  "aria-label": ariaLabel,
}: PromptInputProps) {
  const [value, setValue] = React.useState<string>("");
  const [files, setFiles] = React.useState<File[]>([]);
  const [submitting, setSubmitting] = React.useState<boolean>(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const v = e.target.value;
    setValue(v);
    if (onchange) {
      onchange(v);
    }
  }

  async function handleSubmit(e?: React.FormEvent) {
    if (e) {
      e.preventDefault();
    }

    if (!canSubmit) return;

    setSubmitting(true);
    try {
      if (allowFiles && files.length > 0) {
        await onsubmit(value, files);
      } else {
        await onsubmit(value);
      }
      setFiles([]);
      setValue("");
      
    } catch (error) {
      const err = error instanceof Error ? error : new Error("Error submitting the request");
      if (onError) {
        onError(err);
      } else {
        console.error("Error submitting:", err);
      }
    } finally {
      setSubmitting(false);
    }
  }

  function handleKeydown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (allowFiles && e.target.files) {
      const selectedFiles = Array.from(e.target.files).slice(0, maxfiles);
      setFiles((prev) => [...prev, ...selectedFiles].slice(0, maxfiles));
      
      // Reset input to allow same file selection
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  const canSubmit = React.useMemo(() => {
    const hasMinLength = minLength ? value.trim().length >= minLength : true;
    return value.trim().length > 0 && hasMinLength && !submitting && !loading && !disabled;
  }, [value, submitting, loading, disabled, minLength]);

  const isDisabled = disabled || loading || submitting;

  return (
    <form
      className={cn(
        "relative  rounded-xl shadow-lg p-2  border  w-100",
         'dark: bg-gradient-to-bl from-zinc-900/70 via-zinc-900 to-zinc-900/70 border-zinc-700/70',
        className
      )} onSubmit={handleSubmit}
    >
      {/* File previews */}
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2 px-2 pt-1">
          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center gap-2 bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-700"
            >
              <span className="text-xs text-zinc-300 truncate max-w-[120px]">
                {file.name}
              </span>
              <button
                type="button"
                onClick={() => removeFile(index)}
                disabled={isDisabled}
                className="text-zinc-400 hover:text-white disabled:opacity-50 transition-colors"
                aria-label={`Remove ${file.name}`}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        id={id}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeydown}
        placeholder={placeholder}
        disabled={isDisabled}
        maxLength={maxLength}
        aria-label={ariaLabel || placeholder}
        className="resize-none min-h-20 max-h-45 focus:outline-none w-full p-2 bg-transparent text-white placeholder:text-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ overflow: "auto" }}
      />

      {/* Bottom gradient line */}
      <div className="absolute bg-gradient-to-r from-transparent via-cyan-500/80 to-transparent w-full h-[1px] bottom-0 left-0" />

      {/* Bottom controls */}
      <div className="flex items-center justify-between pt-2 px-1">
        {/* File upload button */}
        {allowFiles && (
          <div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
              accept={acceptedTypes}
              disabled={files.length >= maxfiles || isDisabled}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={files.length >= maxfiles || isDisabled}
              className="text-zinc-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors p-1"
              aria-label="Attach files"
            >
              <Paperclip size={20} />
            </button>
          </div>
        )}

        {/* Character count */}
        {maxLength && (
          <span className="text-xs text-zinc-500 ml-auto mr-2">
            {value.length}/{maxLength}
          </span>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={!canSubmit}
          className={cn(
            "bg-gray-300 w-8 h-8 rounded-full text-gray-700 shadow-lg border border-gray-200/20 flex items-center justify-center transition-all ",
            canSubmit
              ? "hover:bg-gray-200 hover:scale-105 cursor-pointer"
              : "opacity-50 cursor-not-allowed",
            !allowFiles && "ml-auto"
          )}
          aria-label="Submit message"
        >
          <LoadingSwap isLoading={loading || submitting} className="flex items-center justify-center">
            <ArrowUp size={18} />
          </LoadingSwap>
        </button>
      </div>
    </form>
  );
}