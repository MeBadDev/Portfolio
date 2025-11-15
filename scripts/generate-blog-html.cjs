#!/usr/bin/env node
/* Generate static HTML pages for each blog post for SEO/crawling */
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const hljs = require('highlight.js');

const BLOGS_DIR = path.resolve(__dirname, '../public/blogs');
const OUTPUT_DIR = path.resolve(__dirname, '../dist/blog');
const DIST_DIR = path.resolve(__dirname, '../dist');
const ASSETS_DIR = path.join(DIST_DIR, 'assets');
const HIGHLIGHT_CSS = fs.readFileSync(
  path.resolve(__dirname, '../node_modules/highlight.js/styles/github.css'),
  'utf8'
);
const MARKDOWN_CSS = fs.readFileSync(
  path.resolve(__dirname, '../src/markdown.css'),
  'utf8'
);

function stripFrontMatter(md) {
  if (md.startsWith('---')) {
    const end = md.indexOf('\n---', 3);
    if (end !== -1) {
      const after = md.slice(end + 4);
      return after.startsWith('\n') ? after.slice(1) : after;
    }
  }
  return md;
}

function getBuiltCssHrefs() {
  try {
    const files = fs.readdirSync(ASSETS_DIR);
    // Prefer CSS files, typically index-*.css (include all to be safe)
    return files.filter(f => f.endsWith('.css')).map(f => `/assets/${f}`);
  } catch (_) {
    return [];
  }
}

function escapeHtml(text) {
  return text.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function generateHTML(title, content, description, slug) {
  const cssHrefs = getBuiltCssHrefs();
  const cssLinks = cssHrefs.map(href => `<link rel="stylesheet" href="${href}">`).join('\n  ');
  const escapedTitle = escapeHtml(title);
  const escapedDescription = escapeHtml(description || '');
  const siteUrl = process.env.SITE_URL
  const pageUrl = `${siteUrl}/blog/${slug}.html`;
  // TODO: find some solution to not hardcode HTML here (it makes it impossible to preview)
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
  ${cssLinks}
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
    ${MARKDOWN_CSS}
    ${HIGHLIGHT_CSS}
  </style>
</head>
<body>
  <nav>
    <div class="container">
      <a href="/" class="nav-brand">mebaddev.net</a>
      <div class="nav-links">
        <a href="/">Home</a>
        <a href="/#/blogs">Blog</a>
      </div>
    </div>
  </nav>
  <div class="content-wrapper">
    <a href="/#/blogs" class="back-link">← Back to Blogs</a>
    <div class="article-container">
      <h1 class="article-title">${title}</h1>
      <article class="markdown-body">
        ${content}
      </article>
    </div>
  </div>
</body>
</html>`;
}

async function main() {
  // Dynamic import for marked because otherwise my deploy fails :(
  // I hate js modules
  const { marked } = await import('marked');
  
  // Configure syntax highlighting using renderer extension
  marked.use({
    renderer: {
      code({text, lang}) {
        const language = (lang || '').match(/^\S+/)?.[0] || '';
        if (language && hljs.getLanguage(language)) {
          try {
            const highlighted = hljs.highlight(text, { language }).value;
            return `<pre><code class="hljs language-${language}">${highlighted}</code></pre>\n`;
          } catch (e) {
            console.error('Highlight error:', e);
          }
        }
        // Fallback to auto-detect
        try {
          const highlighted = hljs.highlightAuto(text).value;
          return `<pre><code class="hljs">${highlighted}</code></pre>\n`;
        } catch (e) {
          // Fallback to plain text
          const escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
          return `<pre><code>${escaped}</code></pre>\n`;
        }
      }
    }
  });

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const files = fs.readdirSync(BLOGS_DIR)
    .filter(f => f.toLowerCase().endsWith('.md'))
    .map(f => path.join(BLOGS_DIR, f));

  files.forEach(filepath => {
    const raw = fs.readFileSync(filepath, 'utf8');
    const parsed = matter(raw);
    const meta = parsed.data || {};
    const filename = path.basename(filepath);
    
    const slug = (meta.slug || meta.id || filename.replace(/\.md$/i, '')).toString().replace(/_/g, '-');
    const title = meta.title || slug;
    const description = meta.description || '';
    
    // Strip front matter (metadatas) and render
    const body = stripFrontMatter(raw);
    const html = marked.parse(body);
    
    // Generate full HTML page
    const fullHTML = generateHTML(title, html, description, slug);
    
    // Write to public/blog/:slug.html
    const outPath = path.join(OUTPUT_DIR, `${slug}.html`);
    fs.writeFileSync(outPath, fullHTML, 'utf8');
    console.log(`Generated ${outPath}`);
  });

  console.log(`\nGenerated ${files.length} static blog HTML files.`);
}

main().catch(err => {
  console.error('Error generating blog HTML:', err);
  process.exit(1);
});
