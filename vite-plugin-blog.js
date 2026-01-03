import path from 'path';
import { fileURLToPath } from 'url';
import { getBlogEntries, generateManifest, generateBlogHTML } from './scripts/blog-generator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BLOGS_DIR = path.resolve(__dirname, 'public/raw-blogs');

export default function blogPlugin() {
  return {
    name: 'vite-plugin-blog',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/blogs.manifest.json') {
          try {
            const entries = getBlogEntries(BLOGS_DIR);
            const manifest = generateManifest(entries);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(manifest));
            return;
          } catch (e) {
            console.error('Error generating manifest:', e);
            next();
            return;
          }
        }

        const match = req.url.match(/^\/blog\/(.+)\.html$/);
        if (match) {
          const slug = match[1];
          try {
            const entries = getBlogEntries(BLOGS_DIR);
            const entry = entries.find(e => e.slug === slug);

            if (entry) {
              const fullHtml = generateBlogHTML(entry);
              res.setHeader('Content-Type', 'text/html');
              res.end(fullHtml);
              return;
            }
          } catch (e) {
            console.error('Error generating blog HTML:', e);
          }
        }

        next();
      });
    }
  };
}
