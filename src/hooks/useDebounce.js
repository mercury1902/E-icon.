import { useState, useEffect } from 'react';

/**
 * Hook giúp trì hoãn (debounce) việc cập nhật giá trị
 * @param {any} value - Giá trị cần debounce
 * @param {number} delay - Thời gian trì hoãn (ms)
 * @returns {any} Giá trị sau khi được debounce
 */
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
