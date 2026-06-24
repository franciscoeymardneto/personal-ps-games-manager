import { useState, useEffect, useCallback } from "react";

const PREFIX = "jewelcase:";

export function useLocalStorage(key, initialValue) {
  const storageKey = PREFIX + key;

  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw != null ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(value));
    } catch {
      // armazenamento cheio ou indisponível — ignora silenciosamente
    }
  }, [storageKey, value]);

  const reset = useCallback(() => setValue(initialValue), [initialValue]);

  return [value, setValue, reset];
}
