import path from 'path';
import { fileURLToPath } from 'url';
import { getBlogEntries, generateManifest, generateBlogHTML } from './scripts/blog-generator.js';
import { getProjects, generateProjectManifest, generateProjectHTML } from './scripts/project-generator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BLOGS_DIR = path.resolve(__dirname, 'public/raw-blogs');
const PROJECTS_DIR = path.resolve(__dirname, 'public/projects');

export default function blogPlugin() {
  return {
    name: 'vite-plugin-blog',
    configureServer(server) {
      server.watcher.add(BLOGS_DIR);
      server.watcher.add(PROJECTS_DIR);

      const handleFileChange = (file) => {
        if ((file.startsWith(BLOGS_DIR) && file.endsWith('.md')) ||
            (file.startsWith(PROJECTS_DIR))) {
          server.ws.send({
            type: 'full-reload',
            path: '*'
          });
        }
      };

      server.watcher.on('change', handleFileChange);
      server.watcher.on('add', handleFileChange);
      server.watcher.on('unlink', handleFileChange);

      server.middlewares.use(async (req, res, next) => {
        // Blog Manifest
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
        
        // Projects Manifest
        if (req.url === '/projects.manifest.json') {
            try {
              const projects = getProjects(PROJECTS_DIR);
              const manifest = generateProjectManifest(projects);
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(manifest));
              return;
            } catch (e) {
              console.error('Error generating projects manifest:', e);
              next();
              return;
            }
        }

        // Blog HTML
        const blogMatch = req.url.match(/^\/blog\/(.+)\.html$/);
        if (blogMatch) {
          const slug = blogMatch[1];
          try {
            const entries = getBlogEntries(BLOGS_DIR);
            const entry = entries.find(e => e.slug === slug);

            if (entry) {
              const fullHtml = generateBlogHTML(entry);
              const transformedHtml = await server.transformIndexHtml(req.url, fullHtml);
              res.setHeader('Content-Type', 'text/html');
              res.end(transformedHtml);
              return;
            }
          } catch (e) {
            console.error('Error generating blog HTML:', e);
          }
        }
        
        // Devlogs
        const projectMatch = req.url.match(/^\/project\/(.+)\.html$/);
        if (projectMatch) {
            const slug = projectMatch[1];
            try {
                const projects = getProjects(PROJECTS_DIR);
                const project = projects.find(p => p.slug === slug);

                if (project) {
                    const fullHtml = generateProjectHTML(project);
                    const transformedHtml = await server.transformIndexHtml(req.url, fullHtml);
                    res.setHeader('Content-Type', 'text/html');
                    res.end(transformedHtml);
                    return;
                }
            } catch (e) {
                console.error('Error generating project HTML:', e);
            }
        }

        next();
      });
    }
  };
}
