"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  CircleAlert,
  CircleCheck,
  Info,
  LoaderCircle,
  TriangleAlert,
} from "lucide-react";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*  Variants (the skin)                                                        */
/* -------------------------------------------------------------------------- */

export const islandVariants = cva(
  [
    "relative flex max-w-full flex-col overflow-hidden border text-sm shadow-lg",
    "transition-[width,transform,opacity,background-color,border-color] duration-500 ease-[cubic-bezier(0.32,1.25,0.4,1)] motion-reduce:transition-none",
    "data-[state=closed]:pointer-events-none data-[state=closed]:scale-75 data-[state=closed]:opacity-0",
  ],
  {
    variants: {
      variant: {
        default: "border-zinc-800 bg-zinc-950 text-zinc-50",
        success: "border-emerald-900 bg-emerald-950 text-emerald-50",
        error: "border-red-900 bg-red-950 text-red-50",
        warning: "border-amber-900 bg-amber-950 text-amber-50",
        info: "border-sky-900 bg-sky-950 text-sky-50",
      },
      size: {
        compact: "w-44 rounded-[1.375rem]",
        default: "w-72 rounded-[1.375rem]",
        expanded: "w-80 rounded-[1.75rem]",
      },
    },
    defaultVariants: { variant: "default", size: "compact" },
  }
);

export const islandHostVariants = cva(
  "pointer-events-none inset-x-0 z-50 flex justify-center p-3",
  {
    variants: {
      position: { top: "top-0", bottom: "bottom-0" },
      layout: {
        /** Pinned to the viewport. */
        fixed: "fixed",
        /** Pinned to the nearest positioned ancestor. */
        absolute: "absolute",
      },
    },
    defaultVariants: { position: "top", layout: "fixed" },
  }
);

export type IslandVariant = NonNullable<
  VariantProps<typeof islandVariants>["variant"]
>;
export type IslandSize = NonNullable<
  VariantProps<typeof islandVariants>["size"]
>;

/* -------------------------------------------------------------------------- */
/*  Headless primitives: no styles, only data attributes and `asChild`         */
/* -------------------------------------------------------------------------- */

type PartProps = React.ComponentProps<"div"> & { asChild?: boolean };

function part(slot: string) {
  function Part({ asChild, ...props }: PartProps) {
    const Comp = asChild ? Slot.Root : "div";
    return <Comp data-slot={slot} {...props} />;
  }
  Part.displayName = `Island.${slot}`;
  return Part;
}

interface RootProps extends PartProps {
  variant?: IslandVariant;
  size?: IslandSize;
  open?: boolean;
}

function Root({
  asChild,
  variant = "default",
  size = "compact",
  open = true,
  ...props
}: RootProps) {
  const Comp = asChild ? Slot.Root : "div";
  return (
    <Comp
      data-slot="root"
      data-variant={variant}
      data-size={size}
      data-state={open ? "open" : "closed"}
      role={variant === "error" ? "alert" : "status"}
      aria-live={variant === "error" ? "assertive" : "polite"}
      aria-hidden={open ? undefined : true}
      {...props}
    />
  );
}

export const Island = {
  Root,
  Leading: part("leading"),
  Title: part("title"),
  Description: part("description"),
  Trailing: part("trailing"),
  Content: part("content"),
};

/* -------------------------------------------------------------------------- */
/*  Headless state                                                             */
/* -------------------------------------------------------------------------- */

export interface IslandOptions {
  title: React.ReactNode;
  description?: React.ReactNode;
  variant?: IslandVariant;
  /** Force a size; by default it follows the content and the expanded state. */
  size?: IslandSize;
  /** Replaces the default icon. */
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  /** Revealed when the island is expanded (tap the header to toggle). */
  content?: React.ReactNode;
  /** Shows a spinner as the leading icon. */
  loading?: boolean;
  /** Auto-dismiss after this many milliseconds. Omit to keep it open. */
  duration?: number;
}

interface PromiseMessages<T> {
  loading: React.ReactNode;
  success: React.ReactNode | ((value: T) => React.ReactNode);
  error: React.ReactNode | ((error: unknown) => React.ReactNode);
}

export interface IslandApi {
  options: IslandOptions | null;
  open: boolean;
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
  /** Pauses the auto-dismiss timer (done for you on hover and focus). */
  setPaused: (paused: boolean) => void;
  show: (options: IslandOptions) => void;
  update: (patch: Partial<IslandOptions>) => void;
  dismiss: () => void;
  /** Loading → success/error, driven by a promise. Resolves with the promise. */
  promise: <T>(promise: Promise<T>, messages: PromiseMessages<T>) => Promise<T>;
}

const IslandContext = React.createContext<IslandApi | null>(null);

export function IslandProvider({ children }: { children: React.ReactNode }) {
  const [options, setOptions] = React.useState<IslandOptions | null>(null);
  const [open, setOpen] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const [paused, setPaused] = React.useState(false);
  const [key, setKey] = React.useState(0);

  const show = React.useCallback((next: IslandOptions) => {
    setOptions(next);
    setOpen(true);
    setExpanded(false);
    setKey((value) => value + 1);
  }, []);

  const update = React.useCallback((patch: Partial<IslandOptions>) => {
    setOptions((previous) => (previous ? { ...previous, ...patch } : previous));
  }, []);

  const dismiss = React.useCallback(() => {
    setOpen(false);
    setExpanded(false);
  }, []);

  const promise = React.useCallback(
    async <T,>(task: Promise<T>, messages: PromiseMessages<T>) => {
      show({ title: messages.loading, loading: true });
      try {
        const value = await task;
        const title =
          typeof messages.success === "function"
            ? messages.success(value)
            : messages.success;
        show({ title, variant: "success", duration: 2500 });
        return value;
      } catch (error) {
        const title =
          typeof messages.error === "function"
            ? messages.error(error)
            : messages.error;
        show({ title, variant: "error", duration: 4000 });
        throw error;
      }
    },
    [show]
  );

  const duration = options?.duration;
  React.useEffect(() => {
    if (!open || paused || expanded || !duration) return;
    const timer = setTimeout(dismiss, duration);
    return () => clearTimeout(timer);
  }, [open, paused, expanded, duration, key, dismiss]);

  React.useEffect(() => {
    if (!expanded) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setExpanded(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [expanded]);

  const value = React.useMemo<IslandApi>(
    () => ({
      options,
      open,
      expanded,
      setExpanded,
      setPaused,
      show,
      update,
      dismiss,
      promise,
    }),
    [options, open, expanded, show, update, dismiss, promise]
  );

  return (
    <IslandContext.Provider value={value}>{children}</IslandContext.Provider>
  );
}

export function useIsland(): IslandApi {
  const context = React.useContext(IslandContext);
  if (!context) {
    throw new Error("useIsland must be used inside <IslandProvider>");
  }
  return context;
}

/* -------------------------------------------------------------------------- */
/*  Plug and play component                                                    */
/* -------------------------------------------------------------------------- */

const variantIcons: Record<IslandVariant, React.ReactNode> = {
  default: null,
  success: <CircleCheck className="size-5 text-emerald-400" />,
  error: <CircleAlert className="size-5 text-red-400" />,
  warning: <TriangleAlert className="size-5 text-amber-400" />,
  info: <Info className="size-5 text-sky-400" />,
};

export interface DynamicIslandProps extends VariantProps<
  typeof islandHostVariants
> {
  className?: string;
}

export function DynamicIsland({
  position,
  layout,
  className,
}: DynamicIslandProps) {
  const { options, open, expanded, setExpanded, setPaused } = useIsland();
  const variant = options?.variant ?? "default";
  const hasContent = Boolean(options?.content);
  const size: IslandSize = expanded
    ? "expanded"
    : (options?.size ?? (options?.description ? "default" : "compact"));
  const leading =
    options?.leading ??
    (options?.loading ? (
      <LoaderCircle className="size-5 animate-spin motion-reduce:animate-none" />
    ) : (
      variantIcons[variant]
    ));

  const header = (
    <>
      {leading && (
        <Island.Leading className="flex shrink-0 items-center">
          {leading}
        </Island.Leading>
      )}
      <div className="min-w-0 flex-1 text-left">
        <Island.Title className="truncate font-medium">
          {options?.title}
        </Island.Title>
        {options?.description && (
          <Island.Description className="truncate text-xs opacity-70">
            {options.description}
          </Island.Description>
        )}
      </div>
      {options?.trailing && (
        <Island.Trailing className="flex shrink-0 items-center">
          {options.trailing}
        </Island.Trailing>
      )}
    </>
  );
  const headerClass = "flex w-full items-center gap-3 px-4 py-2.5";

  return (
    <div className={islandHostVariants({ position, layout })}>
      <Island.Root
        variant={variant}
        size={size}
        open={open}
        className={cn(
          islandVariants({ variant, size }),
          "pointer-events-auto",
          className
        )}
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        {hasContent ? (
          <button
            type="button"
            aria-expanded={expanded}
            onClick={() => setExpanded(!expanded)}
            className={cn(
              headerClass,
              "cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            )}
          >
            {header}
          </button>
        ) : (
          <div className={headerClass}>{header}</div>
        )}
        {hasContent && (
          <div
            className={cn(
              "grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.32,1.25,0.4,1)] motion-reduce:transition-none",
              expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
            )}
          >
            <div className="min-h-0 overflow-hidden">
              <Island.Content
                data-state={expanded ? "open" : "closed"}
                inert={!expanded}
                className="px-4 pt-1 pb-4"
              >
                {options?.content}
              </Island.Content>
            </div>
          </div>
        )}
      </Island.Root>
    </div>
  );
}
