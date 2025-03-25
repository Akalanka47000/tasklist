import { useEffect, useRef, useState } from 'react';

export function useDebounce(value: any, delay: number = 1000) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
  }, [value, delay]);

  return debouncedValue;
}
