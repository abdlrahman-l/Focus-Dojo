import { useEffect, useMemo, useRef } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFunction = (...args: any[]) => any;

interface DebouncedCallback<T extends AnyFunction> {
  (...args: Parameters<T>): void;
  cancel(): void;
}

export function useDebouncedCallback<T extends AnyFunction>(
  callback: T,
  delay: number,
): DebouncedCallback<T> {
  const callbackRef = useRef(callback);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useMemo(() => {
    const debounced = (...args: Parameters<T>) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => callbackRef.current(...args), delay);
    };
    debounced.cancel = () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
    return debounced;
  }, [delay]);
}