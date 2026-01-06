
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import matter from 'gray-matter';
import hljs from 'highlight.js';
import { marked } from 'marked';
import { stripFrontMatter } from './blog-generator.js';

let ROOT_DIR;
if (import.meta.url) {
    const __filename = new URL(import.meta.url).pathname;
    const __dirname = path.dirname(__filename);
    ROOT_DIR = path.resolve(__dirname, '..');
} else {
    ROOT_DIR = process.cwd();
}

const MARKDOWN_CSS_PATH = path.resolve(ROOT_DIR, 'src/markdown.css');
const HIGHLIGHT_CSS_PATH = path.resolve(ROOT_DIR, 'node_modules/highlight.js/styles/github.css');
const PROJECTS_DB = path.resolve(ROOT_DIR, 'public/projects/projects.json');

export function getProjects(projectsDir) {
  if (!fs.existsSync(projectsDir)) return [];

  let projectFolders = [];
  
  // Try to load order from DB
  if (fs.existsSync(PROJECTS_DB)) {
      try {
          projectFolders = JSON.parse(fs.readFileSync(PROJECTS_DB, 'utf8'));
      } catch (e) {
          console.error("Failed to parse projects.json, falling back to directory scan", e);
      }
  }

  // Get actual folders on disk
  const diskFolders = fs.readdirSync(projectsDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  // Merge: Use DB order, then append any new folders found on disk that aren't in DB
  const missingFolders = diskFolders.filter(f => !projectFolders.includes(f));
  projectFolders = [...projectFolders, ...missingFolders];

  // Filter out any folders from DB that don't exist on disk anymore
  projectFolders = projectFolders.filter(f => diskFolders.includes(f));

  const projects = projectFolders.map(folderName => {
    const projectPath = path.join(projectsDir, folderName);
    const metadataPath = path.join(projectPath, 'project-metadata.yaml');
    
    // Check if metadata exists
    if (!fs.existsSync(metadataPath)) return null;

    try {
      const yamlContent = fs.readFileSync(metadataPath, 'utf8');
      const metadata = yaml.load(yamlContent);
      
      // Get Devlogs
      const devlogsDir = path.join(projectPath, 'devlogs');
      let devlogs = [];
      if (fs.existsSync(devlogsDir)) {
          const devlogFiles = fs.readdirSync(devlogsDir).filter(f => f.endsWith('.md'));
          devlogs = devlogFiles.map(f => {
              const fp = path.join(devlogsDir, f);
              const raw = fs.readFileSync(fp, 'utf8');
              const fileStat = fs.statSync(fp);
              const parsed = matter(raw);
              
              const timeSpent = parseFloat(parsed.data['time-spent'] || parsed.data.timeSpent || 0);
              const order = parsed.data.order !== undefined ? parseFloat(parsed.data.order) : undefined;

              return {
                  filename: f,
                  slug: f.replace(/\.md$/, ''),
                  title: parsed.data.title || f.replace(/\.md$/, ''),
                  timeSpent: isNaN(timeSpent) ? 0 : timeSpent,
                  date: parsed.data.date || fileStat.birthtime.toISOString(), 
                  order,
                  raw,
                  content: parsed.content // For rendering later
              };
          }).sort((a,b) => {
            // Sort by order metadata if available
            if (a.order !== undefined || b.order !== undefined) {
                  const orderA = a.order !== undefined ? a.order : -Infinity;
                  const orderB = b.order !== undefined ? b.order : -Infinity;
                  return orderB - orderA;
              }
              // Fallback to date descending
              return new Date(b.date).getTime() - new Date(a.date).getTime();
          });
          
          const totalTimeSpent = devlogs.reduce((acc, curr) => acc + curr.timeSpent, 0);

          return {
            slug: folderName,
            ...metadata,
            devlogs,
            totalTimeSpent
          };
      }

      return {
        slug: folderName,
        ...metadata,
        devlogs: [],
        totalTimeSpent: 0
      };
    } catch (e) {
      console.error(`Error parsing project ${folderName}:`, e);
      return null;
    }
  }).filter(Boolean);

  return projects;
}

export function generateProjectManifest(projects) {
    return projects.map(p => ({
        slug: p.slug,
        title: p.title,
        summary: p.summary || p.description, // Fallback to description
        description: p.description,
        tags: p.tags,
        status: p.status,
        thumbnail: `/projects/${p.slug}/thumbnail.png`, // Assumption
        demoLink: p.demoLink,
        repoLink: p.repoLink,
        devlogCount: p.devlogs.length,
        totalTimeSpent: p.totalTimeSpent,
        path: `/project/${p.slug}.html`
    }));
}

export function generateProjectHTML(project, cssLinks = []) {
    const { title, description, devlogs, status, demoLink, repoLink, slug, totalTimeSpent } = project;

    const markdownCss = fs.readFileSync(MARKDOWN_CSS_PATH, 'utf8');
    const highlightCss = fs.readFileSync(HIGHLIGHT_CSS_PATH, 'utf8');

    // Parse description as markdown too
    const descriptionHtml = marked.parse(description || '');
    
    // Devlogs HTML
    const devlogsHtml = devlogs.map(log => {
        const body = stripFrontMatter(log.raw);
        const html = marked.parse(body);
        const dateStr = new Date(log.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
        
        return `
        <div class="devlog-entry" id="${log.slug}">
            <div class="devlog-header">
                <h3>${log.title}</h3>
                <div class="devlog-meta">
                    <span class="date">Written on ${dateStr}</span>
                    ${log.timeSpent ? `<span class="separator">•</span><span class="time-spent">Time spent: ${log.timeSpent} hours</span>` : ''}
                </div>
            </div>
            <div class="markdown-body">
                ${html}
            </div>
        </div>
        `;
    }).join('\n<br>\n');

    const cssLinksHtml = cssLinks.map(href => `<link rel="stylesheet" href="${href}">`).join('\n  ');

    // Status Badge Color
    let statusColor = '#71717a';
    if (status === 'ONGOING') statusColor = '#3b82f6';
    if (status === 'PUBLISHED') statusColor = '#22c55e';
    if (status === 'HALTED') statusColor = '#ef4444';
    if (status === 'BREAK') statusColor = '#eab308';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Devlogs</title>
  <meta name="description" content="Devlogs for ${title}">
  
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
      color: #18181b;
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
        max-width: 56rem;
        margin: 2rem auto;
        padding: 0 1rem;
    }

    .project-header {
        background: white;
        border: 4px solid black;
        padding: 2rem;
        margin-bottom: 2rem;
        box-shadow: 8px 8px 0px 0px rgba(0,0,0,1);
    }
    
    .project-title {
        font-size: 3rem;
        margin: 0;
        line-height: 1;
    }
    
    .project-status {
        display: inline-block;
        padding: 0.25rem 0.75rem;
        border-radius: 9999px;
        color: white;
        font-weight: bold;
        background-color: ${statusColor};
        margin-top: 1rem;
        font-size: 1.2rem;
    }

    .project-links {
        margin-top: 1rem;
        display: flex;
        gap: 1rem;
    }
    
    .project-link {
        color: #2563eb;
        text-decoration: underline;
        font-size: 1.25rem;
    }

    .devlogs-container {
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    .devlog-entry {
        background: white;
        border: 4px solid black;
        padding: 2rem;
        box-shadow: 8px 8px 0px 0px rgba(0,0,0,1);
    }
    
    .markdown-body {
        font-family: 'Jersey 10', system-ui, -apple-system, sans-serif !important;
    }


    .devlog-header {
        margin-bottom: 1.5rem;
        border-bottom: 2px solid #e5e7eb;
        padding-bottom: 1rem;
    }

    .devlog-header h3 {
        margin: 0 0 0.5rem 0;
        font-size: 2rem;
    }

    .devlog-meta {
        color: #52525b;
        font-size: 1.25rem;
    }

    .separator {
        font-weight: bold;
        margin: 0 0.5rem;
    }


    .back-link {
      color: #f4f4f5;
      text-decoration: underline;
      font-size: 1.5rem;
      display: inline-block;
      margin-bottom: 2rem;
      background: #18181b;
      padding: 0.5rem 1rem;
      border: 2px solid #3f3f46; 
    }

    ${markdownCss}
    ${highlightCss}

    /* Override markdown css for this context if needed */
    .markdown-body {
        font-family: inherit !important;
    }
  </style>
</head>
<body>
  <nav>
    <div class="container">
      <a href="/" class="nav-brand">mebaddev.net</a>
      <div class="nav-links">
        <a href="/">Home</a>
        <a href="/blogs">Blog</a>
        <a href="/projects">Projects</a>
      </div>
    </div>
  </nav>

  <div class="content-wrapper">
    <a href="/projects" class="back-link">← Back to Projects</a>
    
    <div class="project-header">
        <h1 class="project-title">${title}</h1>
        <span class="project-status">${status}</span>
        ${totalTimeSpent > 0 ? `<div style="font-size: 1.25rem; font-weight: bold; margin-top: 0.5rem; color: #4b5563;">Total Time Spent: ${totalTimeSpent} hours</div>` : ''}
        <div style="font-size: 1.5rem; margin-top: 1rem;" class="markdown-body">${descriptionHtml}</div>
        
        <div class="project-links">
            ${demoLink ? `<a href="${demoLink}" class="project-link" target="_blank">Live Demo</a>` : ''}
            ${repoLink ? `<a href="${repoLink}" class="project-link" target="_blank">Source Code</a>` : ''}
        </div>
    </div>

    <div class="devlogs-container">
        <h2 style="color: white; text-shadow: 2px 2px 0 #000; font-size: 2.5rem; margin-bottom: 1rem;">Devlogs</h2>
        ${devlogsHtml.length > 0 ? devlogsHtml : '<div class="devlog-entry"><p>No devlogs yet.</p></div>'}
    </div>
  </div>
</body>
</html>`;
}
