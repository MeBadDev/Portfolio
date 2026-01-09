import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getProjects, generateProjectHTML } from './project-generator.tsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECTS_DIR = path.resolve(__dirname, '../public/projects');
const OUTPUT_DIR = path.resolve(__dirname, '../dist/project');
const DIST_DIR = path.resolve(__dirname, '../dist');
const ASSETS_DIR = path.join(DIST_DIR, 'assets');

function getBuiltCssHrefs() {
  try {
    const files = fs.readdirSync(ASSETS_DIR);
    return files.filter(f => f.endsWith('.css')).map(f => `/assets/${f}`);
  } catch (_) {
    return [];
  }
}

function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  try {
    const cssHrefs = getBuiltCssHrefs();
    const projects = getProjects(PROJECTS_DIR);
    console.log(`Found ${projects.length} projects.`);

    for (const project of projects) {
      if (!project.slug) continue;
      
      const html = generateProjectHTML(project, cssHrefs);
      const outputFile = path.join(OUTPUT_DIR, `${project.slug}.html`);
      fs.writeFileSync(outputFile, html);
      console.log(`Generated HTML for project: ${project.slug}`);
    }
  } catch (error) {
    console.error('Error generating project HTML:', error);
    process.exit(1);
  }
}

main();
