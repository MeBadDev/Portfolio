import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import hljs from 'highlight.js';
import { marked } from 'marked';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths relative to this script (in scripts/)
const ROOT_DIR = path.resolve(__dirname, '..');
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
          // ignore 
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

export function stripFrontMatter(md) {
  if (md.startsWith('---')) {
    const end = md.indexOf('\n---', 3);
    if (end !== -1) {
      const after = md.slice(end + 4);
      return after.startsWith('\n') ? after.slice(1) : after;
    }
  }
  return md;
}

export function getBlogEntries(blogsDir) {
  const files = fs.readdirSync(blogsDir, { withFileTypes: true })
    .filter(d => d.isFile() && d.name.toLowerCase().endsWith('.md'))
    .map(d => path.join(blogsDir, d.name))
    .sort();

  return files.map(fp => {
    const raw = fs.readFileSync(fp, 'utf8');
    const parsed = matter(raw);
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
    };
  });
}

export function generateManifest(entries) {
  return entries.map(e => ({
    slug: e.slug,
    title: e.title,
    description: e.description,
    tags: e.tags,
    path: `/raw-blogs/${e.filename}`,
    date: e.date
  }));
}

export function generateBlogHTML(entry, cssLinks = []) {
  const { title, description, slug, raw, date } = entry;
  
  const markdownCss = fs.readFileSync(MARKDOWN_CSS_PATH, 'utf8');
  const highlightCss = fs.readFileSync(HIGHLIGHT_CSS_PATH, 'utf8');
  
  const escapedTitle = title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  const escapedDescription = (description || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  
  const body = stripFrontMatter(raw);
  const content = marked.parse(body);

  const wordCount = body.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200); // assuming 200 wpm
  
  const dateObj = new Date(date);
  const dateStr = dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const cssLinksHtml = cssLinks.map(href => `<link rel="stylesheet" href="${href}">`).join('\n  ');
  
  // Site URL for OG tags - try to get from env or default
  const siteUrl = process.env.SITE_URL || 'https://mebaddev.net';
  const pageUrl = `${siteUrl}/blog/${slug}.html`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapedTitle} - MeBadDev</title>
  <meta name="description" content="${escapedDescription}">
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="article">
  <meta property="og:url" content="${pageUrl}">
  <meta property="og:title" content="${escapedTitle}">
  <meta property="og:description" content="${escapedDescription}">
  <meta property="og:site_name" content="MeBadDev">
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${pageUrl}">
  <meta name="twitter:title" content="${escapedTitle}">
  <meta name="twitter:description" content="${escapedDescription}">
  <link rel="canonical" href="${pageUrl}" />

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Jersey+10&display=swap" rel="stylesheet">
  ${cssLinksHtml}
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Jersey 10', system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif;
      background: linear-gradient(-45deg, rgb(54, 116, 181) 25%, rgb(87, 143, 202) 25%, rgb(87, 143, 202) 50%, rgb(54, 116, 181) 50%, rgb(54, 116, 181) 75%, rgb(87, 143, 202) 75%, rgb(87, 143, 202) 100%);
      background-size: 48px 48px;
      animation: pan 40s linear infinite;
      min-height: 100vh;
    }
    @keyframes pan {
      0% { background-position: 0% 0%; }
      100% { background-position: 100% 0%; }
    }
    nav {
      position: sticky;
      top: 0;
      z-index: 50;
      background: #18181b;
      color: #f4f4f5;
      border-bottom: 1px solid #3f3f46;
    }
    nav .container {
      max-width: 72rem;
      margin: 0 auto;
      padding: 0.75rem 1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    nav a {
      color: #f4f4f5;
      text-decoration: none;
    }
    nav a:hover {
      text-decoration: underline;
    }
    .nav-brand {
      font-size: 1.5rem;
      font-weight: bold;
    }
    .nav-links {
      display: flex;
      gap: 1.5rem;
      font-size: 1.25rem;
    }
    .content-wrapper {
      max-width: 48rem;
      margin: 0 auto;
      padding: 1rem 1rem 2rem;
    }
    .back-link {
      color: #f4f4f5;
      text-decoration: underline;
      font-size: 1.25rem;
      display: inline-block;
      margin-bottom: 1rem;
    }
    .article-container {
      background: white;
      color: #18181b;
      border: 6px solid #000000;
      padding: 2rem;
      box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);
    }
    .article-title {
      font-size: 3.75rem;
      margin-bottom: 1rem;
      color: #111827;
    }
    .blog-meta {
      font-size: 1.25rem;
      color: #52525b;
      margin-bottom: 2rem;
      display: flex;
      gap: 0.5rem;
      align-items: center;
      flex-wrap: wrap;
    }
    .separator {
      font-weight: bold;
    }
    ${markdownCss}
    ${highlightCss}
  </style>
</head>
<body>
  <nav>
    <div class="container">
      <a href="/" class="nav-brand">mebaddev.net</a>
      <div class="nav-links">
        <a href="/">Home</a>
        <a href="/blogs">Blog</a>
      </div>
    </div>
  </nav>
  <div class="content-wrapper">
    <a href="/blogs" class="back-link">← Back to Blogs</a>
    <div class="article-container">
      <h1 class="article-title">${title}</h1>
      <div class="blog-meta">
        <span>Written on ${dateStr}</span>
        <span class="separator">•</span>
        <span class="reading-time">~${readingTime} minute read</span>
      </div>
      <article class="markdown-body">
        ${content}
      </article>
    </div>
  </div>
</body>
</html>`;
}
