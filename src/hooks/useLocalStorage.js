import { useState, useEffect, useCallback } from 'react';

/**
 * Auth-aware localStorage hook.
 * When isGuest=true, state is ephemeral (not persisted).
 * When isGuest=false, state is persisted to localStorage.
 */
export function useLocalStorage(key, initialValue, isGuest = false) {
  const [storedValue, setStoredValue] = useState(() => {
    if (isGuest) return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // Sync to storage when value changes (only for authenticated users)
  useEffect(() => {
    if (isGuest) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch {
      // Storage quota exceeded or unavailable
    }
  }, [key, storedValue, isGuest]);

  const setValue = useCallback((value) => {
    setStoredValue((prev) =>
      typeof value === 'function' ? value(prev) : value
    );
  }, []);

  return [storedValue, setValue];
}
