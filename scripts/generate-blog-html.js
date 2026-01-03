#!/usr/bin/env node
/* Generate static HTML pages for each blog post for SEO/crawling */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getBlogEntries, generateBlogHTML } from './blog-generator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BLOGS_DIR = path.resolve(__dirname, '../public/raw-blogs');
const OUTPUT_DIR = path.resolve(__dirname, '../dist/blog');
const DIST_DIR = path.resolve(__dirname, '../dist');
const ASSETS_DIR = path.join(DIST_DIR, 'assets');

function getBuiltCssHrefs() {
  try {
    const files = fs.readdirSync(ASSETS_DIR);
    // Prefer CSS files, typically index-*.css (include all to be safe)
    return files.filter(f => f.endsWith('.css')).map(f => `/assets/${f}`);
  } catch (_) {
    return [];
  }
}

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const cssHrefs = getBuiltCssHrefs();
  const entries = getBlogEntries(BLOGS_DIR);

  entries.forEach(entry => {
    const fullHTML = generateBlogHTML(entry, cssHrefs);
    
    // Write to public/blog/:slug.html
    const outPath = path.join(OUTPUT_DIR, `${entry.slug}.html`);
    fs.writeFileSync(outPath, fullHTML, 'utf8');
    console.log(`Generated ${outPath}`);
  });

  console.log(`\nGenerated ${entries.length} static blog HTML files.`);
}

main().catch(err => {
  console.error('Error generating blog HTML:', err);
  process.exit(1);
});
