
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import matter from 'gray-matter';
import hljs from 'highlight.js';
import { marked } from 'marked';
import { stripFrontMatter } from './blog-generator.tsx';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { StaticProjectLayout } from '../src/layouts/StaticProjectLayout.tsx';

const ROOT_DIR = process.cwd();

const MARKDOWN_CSS_PATH = path.resolve(ROOT_DIR, 'src/markdown.css');
const HIGHLIGHT_CSS_PATH = path.resolve(ROOT_DIR, 'node_modules/highlight.js/styles/github.css');
const PROJECTS_DB = path.resolve(ROOT_DIR, 'public/projects/projects.json');

export interface Devlog {
    filename: string;
    slug: string;
    title: string;
    timeSpent: number;
    date: string;
    order?: number;
    raw: string;
    content: string;
}

export interface Project {
    slug: string;
    title: string;
    summary?: string;
    description: string;
    tags: string[];
    status: string;
    demoLink?: string;
    repoLink?: string;
    devlogs: Devlog[];
    totalTimeSpent: number;
}

export function getProjects(projectsDir: string): Project[] {
  if (!fs.existsSync(projectsDir)) return [];

  let projectFolders: string[] = [];
  
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
      const metadata = yaml.load(yamlContent) as any;
      
      // Get Devlogs
      const devlogsDir = path.join(projectPath, 'devlogs');
      let devlogs: Devlog[] = [];
      if (fs.existsSync(devlogsDir)) {
          const devlogFiles = fs.readdirSync(devlogsDir).filter(f => f.endsWith('.md'));
          devlogs = devlogFiles.map(f => {
              const fp = path.join(devlogsDir, f);
              const raw = fs.readFileSync(fp, 'utf8');
              const fileStat = fs.statSync(fp);
              // @ts-ignore
              const parsed = matter(raw) as any;
              
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
              } as Devlog;
          }).sort((a,b) => {
            // Sort by order metadata if available
            if (a.order !== undefined || b.order !== undefined) {
                  const orderA = a.order !== undefined ? a.order : -Infinity;
                  const orderB = b.order !== undefined ? b.order : -Infinity;
                  return (orderB || 0) - (orderA || 0);
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
          } as Project;
      }

      return {
        slug: folderName,
        ...metadata,
        devlogs: [],
        totalTimeSpent: 0
      } as Project;
    } catch (e) {
      console.error(`Error parsing project ${folderName}:`, e);
      return null;
    }
  }).filter(Boolean) as Project[];

  return projects;
}

export function generateProjectManifest(projects: Project[]) {
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

export function generateProjectHTML(project: Project, cssLinks: string[] = []) {
    const { title, description, devlogs, status, demoLink, repoLink, slug, totalTimeSpent } = project;

    const markdownCss = fs.readFileSync(MARKDOWN_CSS_PATH, 'utf8');
    const highlightCss = fs.readFileSync(HIGHLIGHT_CSS_PATH, 'utf8');

    // Parse description as markdown too
    const descriptionHtml = marked.parse(description || '') as string;
    
    // Status Badge Color
    let statusColor = '#71717a';
    if (status === 'ONGOING') statusColor = '#3b82f6';
    if (status === 'PUBLISHED') statusColor = '#22c55e';
    if (status === 'HALTED') statusColor = '#ef4444';
    if (status === 'BREAK') statusColor = '#eab308';

    // Prepare devlogs data for the component
    const devlogsData = devlogs.map(log => {
        const body = stripFrontMatter(log.raw);
        const html = marked.parse(body) as string;
        const dateStr = new Date(log.date).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
        
        return {
          title: log.title,
          slug: log.slug,
          dateStr: dateStr,
          timeSpent: log.timeSpent,
          contentHtml: html
        };
    });

    const html = renderToStaticMarkup(
      <StaticRouter location={`/project/${slug}`}>
        <StaticProjectLayout 
          title={title}
          descriptionHtml={descriptionHtml}
          status={status}
          statusColor={statusColor}
          demoLink={demoLink}
          repoLink={repoLink}
          totalTimeSpent={totalTimeSpent}
          devlogs={devlogsData}
          cssLinks={cssLinks}
          markdownCss={markdownCss}
          highlightCss={highlightCss}
          slug={slug}
        />
      </StaticRouter>
    );

    return `<!DOCTYPE html>\n${html}`;
}
