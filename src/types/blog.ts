export interface BlogMeta {
  slug: string;      // unique slug like 003-annoying-bookmarklet
  title: string;
  description: string;
  tags: string[];
  path: string;      // /raw-blogs/003_annoying_bookmarklet.md
  date: string;      // YYYY-MM-DD
  unix_time?: number; // unix timestamp in seconds

}
