import { useEffect, useState, useRef, useCallback } from "react";

export function useDebounce<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const flush = useCallback(() => {
    cancel();
    setDebounced(value);
  }, [value, cancel]);

  useEffect(() => {
    // Clear any previous timeout before setting a new one
    cancel();

    timeoutRef.current = setTimeout(() => {
      setDebounced(value);
    }, delay);

    // Cleanup on unmount or when value/delay changes
    return cancel;
  }, [value, delay, cancel]);

  return { cancel, flush, debounced };
}
