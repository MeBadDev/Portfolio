#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getBlogEntries, generateManifest } from './blog-generator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BLOGS_DIR = path.resolve(__dirname, '../public/raw-blogs');
const OUTPUT_JSON = path.resolve(__dirname, '../dist/blogs.manifest.json');

function main() {
  // Ensure dist exists
  const distDir = path.resolve(__dirname, '../dist');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  const entries = getBlogEntries(BLOGS_DIR);
  const manifest = generateManifest(entries);

  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(manifest, null, 2));
  console.log(`Generated ${OUTPUT_JSON}`);
}

main();
