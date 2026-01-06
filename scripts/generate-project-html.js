import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getProjects, generateProjectHTML } from './project-generator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECTS_DIR = path.resolve(__dirname, '../public/projects');
const OUTPUT_DIR = path.resolve(__dirname, '../dist/project');

function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  try {
    const projects = getProjects(PROJECTS_DIR);
    console.log(`Found ${projects.length} projects.`);

    for (const project of projects) {
      if (!project.slug) continue;
      
      const html = generateProjectHTML(project);
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
