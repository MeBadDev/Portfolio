#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const BLOGS_DIR = path.resolve(__dirname, '../public/blogs');
const OUTPUT_JSON = path.resolve(__dirname, '../dist/blogs.manifest.json');

function safeReadDir(dir) {
  try { return fs.readdirSync(dir, { withFileTypes: true }); }
  catch (e) { return []; }
}

function toSlug(meta, filename) {
  if (meta && (meta.slug || meta.id)) return (meta.slug || meta.id).toString().replace(/_/g, '-');
  return filename.replace(/\.md$/i, '').replace(/_/g, '-');
}

function main() {
  // Ensure dist exists
  const distDir = path.resolve(__dirname, '../dist');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  const entries = safeReadDir(BLOGS_DIR)
    .filter(d => d.isFile() && d.name.toLowerCase().endsWith('.md'))
    .map(d => path.join(BLOGS_DIR, d.name))
    .sort();

  const items = entries.map(fp => {
    const raw = fs.readFileSync(fp, 'utf8');
    const parsed = matter(raw);
    const meta = parsed.data || {};
    const filename = path.basename(fp);
    const slug = toSlug(meta, filename);
    const title = meta.title || slug;
    const description = meta.description || '';
    const tags = Array.isArray(meta.tags) ? meta.tags : (typeof meta.tags === 'string' ? String(meta.tags).split(/\s*,\s*/) : []);
    const date = meta.date;

    return {
      slug,
      title,
      description,
      tags,
      path: `/blogs/${filename}`,
      date
    };
  });

  // sort newest first by date
  items.sort((a, b) => new Date(b.date) - new Date(a.date));

  const payload = JSON.stringify(items, null, 2);
  fs.writeFileSync(OUTPUT_JSON, payload, 'utf8');

  console.log(`Generated ${OUTPUT_JSON} with ${items.length} entries.`);
}

main();
