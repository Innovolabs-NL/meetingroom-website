import type { SupportedStorage } from "@supabase/supabase-js";

/** In-memory storage for one-off auth clients (never touches browser cookies). */
export function createMemoryAuthStorage(): SupportedStorage {
  const store = new Map<string, string>();
  return {
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, value) => {
      store.set(key, value);
    },
    removeItem: (key) => {
      store.delete(key);
    },
  };
}
