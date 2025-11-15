import type { BlogMeta } from './types/blog';

// Runtime-loaded manifest (generated into /dist/blogs.manifest.json during build).
// We fetch it on-demand instead of bundling a copy in src so that only the dist artifact exists.

let manifestCache: BlogMeta[] | null = null;
let manifestPromise: Promise<BlogMeta[]> | null = null;

async function loadManifest(): Promise<BlogMeta[]> {
  // If already loaded, return cache.
  if (manifestCache) return manifestCache;
  // If a request is in-flight, return same promise.
  if (manifestPromise) return manifestPromise;
  manifestPromise = (async () => {
    try {
      const res = await fetch('/blogs.manifest.json', { cache: 'no-store' });
      if (!res.ok) {
        console.warn('[blogData] Failed to fetch blogs.manifest.json:', res.status);
        return [];
      }
      const data = (await res.json()) as BlogMeta[];
      manifestCache = data ?? [];
      return manifestCache;
    } catch (err) {
      console.warn('[blogData] Error fetching manifest', err);
      return [];
    } finally {
      manifestPromise = null; // allow retry if needed
    }
  })();
  return manifestPromise;
}

export async function fetchAllBlogs(): Promise<BlogMeta[]> {
  const data = await loadManifest();
  // return a shallow copy to avoid external mutation of cache.
  return [...data];
}

export function sortBlogsNewestFirst(list: BlogMeta[]): BlogMeta[] {
  return [...list].sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export function sortBlogsOldestFirst(list: BlogMeta[]): BlogMeta[] {
  return [...list].sort((a, b) => +new Date(a.date) - +new Date(b.date));
}

export function getLatestFrom(list: BlogMeta[], n = 3): BlogMeta[] {
  return sortBlogsNewestFirst(list).slice(0, n);
}

// Convenience async helper for latest
export async function fetchLatest(n = 3): Promise<BlogMeta[]> {
  const all = await fetchAllBlogs();
  return getLatestFrom(all, n);
}
