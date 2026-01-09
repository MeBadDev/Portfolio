import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getBlogEntries } from './blog-generator.tsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = process.env.SITE_URL || 'https://mebaddev.net';
const BLOGS_DIR = path.resolve(__dirname, '../public/raw-blogs');
const OUT_FILE = path.resolve(__dirname, '../dist/rss.xml');

function escape(str) {
  return str.replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
}

function generateRSS(items) {
  const header = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n<channel>\n<title>MeBadDev Blog</title>\n<link>${SITE_URL}</link>\n<description>Latest posts from MeBadDev</description>\n<language>en-us</language>`;
  const body = items.map(it => {
    return `<item>
<title>${escape(it.title)}</title>
<link>${it.url}</link>
<description>${escape(it.description)}</description>
<pubDate>${it.date.toUTCString()}</pubDate>
<guid>${it.url}</guid>
</item>`;
  }).join('\n');
  const footer = `\n</channel>\n</rss>`;
  return header + body + footer;
}

function main() {
  const entries = getBlogEntries(BLOGS_DIR);
  
  const items = entries.map(entry => {
    const { meta, slug, title, description } = entry;
    
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
    return { title, description, date, url };
  }).sort((a,b)=> b.date - a.date);

  const rss = generateRSS(items);
  
  // Ensure dist exists
  const distDir = path.dirname(OUT_FILE);
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }
  
  fs.writeFileSync(OUT_FILE, rss, 'utf8');
  console.log(`Generated ${OUT_FILE}`);
}

main();
