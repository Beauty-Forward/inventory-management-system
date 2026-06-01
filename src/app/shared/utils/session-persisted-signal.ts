import { WritableSignal, effect, signal } from '@angular/core';

/**
 * A writable signal whose value is mirrored into sessionStorage, so it
 * survives a page refresh within the same browser session. A brand-new
 * browser session starts with empty sessionStorage and falls back to
 * `fallback` — sessionStorage (not localStorage) is the right scope because
 * it's cleared when the tab/session ends but kept across reloads of the same
 * tab.
 *
 * Reads and writes are guarded so SSR or privacy-mode environments (where
 * storage access throws) degrade gracefully to the in-memory default.
 *
 * Must be called from an injection context (e.g. a component field
 * initializer or constructor) because it registers an effect().
 */
export function sessionPersistedSignal<T extends string>(
  storageKey: string,
  fallback: T,
  validValues: readonly T[],
): WritableSignal<T> {
  const state = signal<T>(readStored(storageKey, validValues) ?? fallback);
  effect(() => {
    try {
      sessionStorage.setItem(storageKey, state());
    } catch {
      // sessionStorage unavailable — skip persistence.
    }
  });
  return state;
}

function readStored<T extends string>(
  storageKey: string,
  validValues: readonly T[],
): T | null {
  try {
    const stored = sessionStorage.getItem(storageKey);
    if (stored && (validValues as readonly string[]).includes(stored)) {
      return stored as T;
    }
  } catch {
    // sessionStorage unavailable — fall through to the default.
  }
  return null;
}
