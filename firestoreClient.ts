// Firestore is loaded on demand so the Firebase SDK (the largest dependency) is not part of the
// first page load. The site renders with its built-in defaults, then live data streams in once the
// browser is idle; forms load it (if not already loaded) when they are submitted.
type FirestoreModule = typeof import('firebase/firestore');
export type FirestoreClient = FirestoreModule & { db: import('firebase/firestore').Firestore };

let clientPromise: Promise<FirestoreClient> | null = null;

export function loadFirestore(): Promise<FirestoreClient> {
  if (!clientPromise) {
    clientPromise = Promise.all([import('./firebase'), import('firebase/firestore')])
      .then(([app, firestore]) => ({ ...firestore, db: app.db }))
      .catch((err) => {
        clientPromise = null; // allow a retry (e.g. a later form submit) after a failed chunk load
        throw err;
      });
  }
  return clientPromise;
}

/** Run `cb` when the main thread is idle (or after `timeout` ms at the latest). Returns a cancel fn. */
export function whenIdle(cb: () => void, timeout = 2000): () => void {
  if (typeof window === 'undefined') return () => {};
  const w = window as Window & {
    requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    cancelIdleCallback?: (id: number) => void;
  };
  if (w.requestIdleCallback) {
    const id = w.requestIdleCallback(cb, { timeout });
    return () => w.cancelIdleCallback?.(id);
  }
  const id = window.setTimeout(cb, 200);
  return () => window.clearTimeout(id);
}
