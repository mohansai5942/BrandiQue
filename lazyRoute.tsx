import React from 'react';

type Loader<P> = () => Promise<{ default: React.ComponentType<P> }>;
export type LazyRoute<P = {}> = React.FC<P> & { preload: () => Promise<void>; prefetch: () => Promise<void> };

const RELOAD_KEY = 'brandique_chunk_reload_at';

/**
 * A code-split chunk failed to load. The usual cause is a new deploy while this tab was open (the old
 * chunk files are gone), sometimes a network blip. Reload once to pick up the current build; never
 * more than once per 10 s so a persistent failure cannot cause a reload loop.
 */
export function recoverFromChunkError(): void {
  if (typeof window === 'undefined') return;
  try {
    const last = Number(sessionStorage.getItem(RELOAD_KEY) || 0);
    if (Date.now() - last < 10000) return;
    sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
  } catch (_) {
    return; // storage unavailable: do not risk a reload loop
  }
  window.location.reload();
}

const Nothing: React.FC = () => null;

/** React.lazy for optional widgets: if the chunk cannot be loaded, recover (see above) and render nothing
 *  instead of letting the error take down the whole page. */
export function lazyWidget<T extends React.ComponentType<any>>(loader: () => Promise<{ default: T }>): React.LazyExoticComponent<T> {
  return React.lazy<T>(() =>
    loader().catch(() => {
      recoverFromChunkError();
      return { default: Nothing as unknown as T };
    })
  );
}

/**
 * Route-level code splitting without a loading flash. Unlike React.lazy, once a chunk has been
 * preloaded the component renders synchronously, so the first client render can hydrate the
 * prerendered page exactly (index.tsx preloads the current route before rendering) and later
 * navigations are instant (App preloads the other routes when the browser is idle).
 */
export function lazyRoute<P = {}>(loader: Loader<P>): LazyRoute<P> {
  let Component: React.ComponentType<P> | null = null;
  let pending: Promise<void> | null = null;
  let failed = false;

  // `recover`: a page the visitor is opening failed to load -> recover (reload). Background prefetches
  // just give up quietly and let a later real navigation try again.
  const load = (recover: boolean) => {
    if (!pending) {
      pending = loader()
        .then((m) => {
          Component = m.default;
        })
        .catch((err) => {
          pending = null;
          if (recover) {
            failed = true;
            recoverFromChunkError();
          }
          throw err;
        });
    }
    return pending;
  };
  const preload = () => load(true);
  const prefetch = () => load(false);

  const Route = ((props: P) => {
    if (Component) return React.createElement(Component as React.ComponentType<any>, props as any);
    if (failed) return null; // reloading (or failed twice in 10 s): render nothing rather than loop
    // Suspend until the chunk is in (a settled promise either way, so React simply re-renders).
    throw preload().catch(() => undefined);
  }) as LazyRoute<P>;
  Route.preload = preload;
  Route.prefetch = prefetch;
  return Route;
}
