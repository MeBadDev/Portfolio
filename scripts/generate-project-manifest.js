import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getProjects, generateProjectManifest } from './project-generator.tsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECTS_DIR = path.resolve(__dirname, '../public/projects');
const OUTPUT_JSON = path.resolve(__dirname, '../dist/projects.manifest.json');

function main() {
  const distDir = path.resolve(__dirname, '../dist');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  try {
    const projects = getProjects(PROJECTS_DIR);
    const manifest = generateProjectManifest(projects);
    fs.writeFileSync(OUTPUT_JSON, JSON.stringify(manifest, null, 2));
    console.log(`Generated projects manifest at ${OUTPUT_JSON}`);
  } catch (error) {
    console.error('Error generating project manifest:', error);
    process.exit(1);
  }
}

main();
