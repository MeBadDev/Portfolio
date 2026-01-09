import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import hljs from 'highlight.js';
import { marked } from 'marked';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { StaticBlogLayout } from '../src/layouts/StaticBlogLayout.tsx';

// Paths relative to project root
const ROOT_DIR = process.cwd();
const MARKDOWN_CSS_PATH = path.resolve(ROOT_DIR, 'src/markdown.css');
const HIGHLIGHT_CSS_PATH = path.resolve(ROOT_DIR, 'node_modules/highlight.js/styles/github.css');

marked.use({
  renderer: {
    code({text, lang}) {
      const language = (lang || '').match(/^\S+/)?.[0] || '';
      if (language && hljs.getLanguage(language)) {
        try {
          const highlighted = hljs.highlight(text, { language }).value;
          return `<pre><code class="hljs language-${language}">${highlighted}</code></pre>\n`;
        } catch (e) {
          // ignore lol
        }
      }
      try {
        const highlighted = hljs.highlightAuto(text).value;
        return `<pre><code class="hljs">${highlighted}</code></pre>\n`;
      } catch (e) {
        const escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return `<pre><code>${escaped}</code></pre>\n`;
      }
    }
  }
});

export interface BlogEntry {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  date: string;
  path: string;
  filename: string;
  raw: string;
  meta: any;
}

export function stripFrontMatter(md: string) {
  if (md.startsWith('---')) {
    const end = md.indexOf('\n---', 3);
    if (end !== -1) {
      const after = md.slice(end + 4);
      return after.startsWith('\n') ? after.slice(1) : after;
    }
  }
  return md;
}

export function getBlogEntries(blogsDir: string): BlogEntry[] {
  const files = fs.readdirSync(blogsDir, { withFileTypes: true })
    .filter(d => d.isFile() && d.name.toLowerCase().endsWith('.md'))
    .map(d => path.join(blogsDir, d.name))
    .sort();

  return files.map(fp => {
    const raw = fs.readFileSync(fp, 'utf8');
    // @ts-ignore
    const parsed = matter(raw) as any;
    const meta = parsed.data || {};
    const filename = path.basename(fp);
    const slug = (meta.slug || meta.id || filename.replace(/\.md$/i, '')).toString().replace(/_/g, '-');
    const title = meta.title || slug;
    const description = meta.description || '';
    const tags = Array.isArray(meta.tags) ? meta.tags : (typeof meta.tags === 'string' ? String(meta.tags).split(/\s*,\s*/) : []);
    const date = meta.date;

    return {
      slug,
      title,
      description,
      tags,
      date,
      path: `/raw-blogs/${filename}`, // This is the public path to the md file if needed, or just for reference
      filename,
      raw,
      meta
    } as BlogEntry;
  });
}

export function generateManifest(entries: BlogEntry[]) {
  return entries.map(e => ({
    slug: e.slug,
    title: e.title,
    description: e.description,
    tags: e.tags,
    path: `/raw-blogs/${e.filename}`,
    date: e.date
  }));
}

export function generateBlogHTML(entry: BlogEntry, cssLinks: string[] = []) {
  const { title, description, slug, raw, date } = entry;
  
  const markdownCss = fs.readFileSync(MARKDOWN_CSS_PATH, 'utf8');
  const highlightCss = fs.readFileSync(HIGHLIGHT_CSS_PATH, 'utf8');
    
  const body = stripFrontMatter(raw);
  const content = marked.parse(body) as string;

  const wordCount = body.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200); // assuming 200 wpm

  
  const dateObj = new Date(date);
  const dateStr = dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  // Render via React Component
  const html = renderToStaticMarkup(
    <StaticRouter location={`/blog/${slug}`}>
      <StaticBlogLayout 
        title={title}
        description={description}
        slug={slug}
        dateStr={dateStr}
        readingTime={readingTime}
        contentHtml={content}
        cssLinks={cssLinks}
        markdownCss={markdownCss}
        highlightCss={highlightCss}
      />
    </StaticRouter>
  );

  return `<!DOCTYPE html>\n${html}`;
}
