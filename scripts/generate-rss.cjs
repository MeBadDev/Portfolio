#!/usr/bin/env node
/* Generate RSS 2.0 feed from blog markdown files
   Output: dist/rss.xml
*/
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const SITE_URL = process.env.SITE_URL || 'https://mebaddev.net';
const BLOGS_DIR = path.resolve(__dirname, '../public/blogs');
const OUT_FILE = path.resolve(__dirname, '../dist/rss.xml');function readBlogs() {
  return fs.readdirSync(BLOGS_DIR)
    .filter(f => f.toLowerCase().endsWith('.md'))
    .map(f => path.join(BLOGS_DIR, f));
}

function escape(str) {
  return str.replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
}

function buildItems(files) {
  return files.map(fp => {
    const raw = fs.readFileSync(fp, 'utf8');
    const parsed = matter(raw);
    const meta = parsed.data || {};
    const filename = path.basename(fp);
  const slugRaw = meta.slug || meta.id || filename.replace(/\.md$/,'');
  const slug = slugRaw.toString().replace(/_/g,'-');
    const title = meta.title || slug;
    const description = meta.description || '';
    
    // use unix_time if available, otherwise use date at 00:00
    let date;
    if (meta.unix_time) {
      // unix_time is in seconds, convert to milliseconds
      date = new Date(meta.unix_time * 1000);
    } else {
      // Use date at 00:00 UTC
      date = new Date(meta.date);
    }
    
  // Link to static HTML blog page
  const url = `${SITE_URL}/blog/${slug}.html`;
    return { title, description, date, url, content: parsed.content };
  }).sort((a,b)=> b.date - a.date);
}

function generateRSS(items) {
  const header = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n<channel>\n<title>MeBadDev Blog</title>\n<link>${SITE_URL}</link>\n<description>Latest posts from MeBadDev</description>\n<language>en-us</language>`;
  const body = items.map(it => {
    return `<item>\n<title>${escape(it.title)}</title>\n<link>${it.url}</link>\n<guid>${it.url}</guid>\n<pubDate>${it.date.toUTCString()}</pubDate>\n<description>${escape(it.description)}</description>\n</item>`;
  }).join('\n');
  const footer = '\n</channel>\n</rss>\n';
  return header + '\n' + body + footer;
}

function main() {
  const distDir = path.resolve(__dirname, '../dist');
  if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });
  const files = readBlogs();
  const items = buildItems(files);
  const xml = generateRSS(items);
  fs.writeFileSync(OUT_FILE, xml, 'utf8');
  console.log(`RSS written: ${OUT_FILE} (${items.length} items)`);
}

main();
