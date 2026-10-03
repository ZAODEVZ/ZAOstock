/**
 * Which pages a pull request can change, from the files it touches.
 *
 * The visual reviewer screenshots these routes on the PR build and on
 * production, so it compares before with after rather than judging a page
 * with nothing to compare it to. A change under src/app/<route>/ maps to that
 * route. Anything shared (components, content, styles, lib) can move any
 * page, so it maps to the default set: the pages people actually land on.
 */
export const DEFAULT_ROUTES = ['/', '/program', '/live', '/musicians'];
export const MAX_ROUTES = 6;

// Route groups and private folders that never render as their own URL.
const SKIP_SEGMENT = /^(api|_.*|\(.*\))$/;

export function routesFor(files) {
  const routes = new Set();
  let shared = false;
  for (const f of files) {
    const m = f.match(/^src\/app\/(.*)$/);
    if (!m) {
      if (/^(src\/|public\/|app\/|styles\/)/.test(f)) shared = true;
      continue;
    }
    const parts = m[1].split('/');
    parts.pop(); // the file itself
    if (parts.length === 0) { routes.add('/'); continue; }
    if (SKIP_SEGMENT.test(parts[0])) { if (parts[0] !== 'api') shared = true; continue; }
    // Dynamic segments ([slug]) have no single URL; the parent list page is the
    // nearest thing a screenshot can show.
    const cut = parts.findIndex((p) => p.startsWith('['));
    const kept = cut === -1 ? parts : parts.slice(0, cut);
    routes.add(kept.length ? '/' + kept.join('/') : '/');
  }
  if (shared || routes.size === 0) DEFAULT_ROUTES.forEach((r) => routes.add(r));
  return [...routes].slice(0, MAX_ROUTES);
}
