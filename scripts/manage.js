import { program } from 'commander';
import inquirer from 'inquirer';
import inquirerAutocompletePrompt from 'inquirer-autocomplete-prompt';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import { execSync, spawn } from 'child_process';
import yaml from 'js-yaml'; 
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '..');
const BLOGS_DIR = path.resolve(ROOT_DIR, 'public/raw-blogs');
const PROJECTS_DIR = path.resolve(ROOT_DIR, 'public/projects');
const PROJECTS_DB = path.resolve(PROJECTS_DIR, 'projects.json');

inquirer.registerPrompt('autocomplete', inquirerAutocompletePrompt);

function getSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
}

function getCurrentProjects() {
  if (!fs.existsSync(PROJECTS_DIR)) return [];
  const folders = fs.readdirSync(PROJECTS_DIR).filter(f => {
      const stats = fs.statSync(path.join(PROJECTS_DIR, f));
      return stats.isDirectory() && fs.existsSync(path.join(PROJECTS_DIR, f, 'project-metadata.yaml'));
  });
  return folders;
}

function loadProjectOrder() {
  if (fs.existsSync(PROJECTS_DB)) {
    try {
      const data = JSON.parse(fs.readFileSync(PROJECTS_DB, 'utf8'));
      // Basic validation: ensure it's an array of strings
      if (Array.isArray(data)) return data;
    } catch (e) {
      console.warn(chalk.yellow('Warning: Failed to parse projects.json, falling back to directory scan.'));
    }
  }
  // Fallback: alphabetical
  return getCurrentProjects().sort();
}

function saveProjectOrder(order) {
  fs.writeFileSync(PROJECTS_DB, JSON.stringify(order, null, 2));
}

function getProjectMetadata(slug) {
  const metaPath = path.join(PROJECTS_DIR, slug, 'project-metadata.yaml');
  if (fs.existsSync(metaPath)) {
    try {
      return yaml.load(fs.readFileSync(metaPath, 'utf8'));
    } catch (e) {
      return null;
    }
  }
  return null;
}

// --- Commands ---

program
  .name('portfolio-cli')
  .description('this thingy manages blogs and projects')
  .version('1.0.0');

const blogCmd = program.command('blog').description('Manage blogs');

blogCmd
  .command('tags')
  .description('Show all used blog tags')
  .action(() => {
    const files = fs.readdirSync(BLOGS_DIR).filter(f => f.endsWith('.md'));
    const tags = new Set();
    files.forEach(f => {
      const content = fs.readFileSync(path.join(BLOGS_DIR, f), 'utf8');
      const parsed = matter(content);
      if (parsed.data.tags && Array.isArray(parsed.data.tags)) {
        parsed.data.tags.forEach(t => tags.add(t));
      }
    });
    console.log(chalk.blue.bold('Used Tags:'));
    console.log([...tags].sort().join(', '));
  });

blogCmd
  .command('create')
  .description('Create a new blog post')
  .action(async () => {
    const answers = await inquirer.prompt([
      { type: 'input', name: 'title', message: 'Blog Title:' },
      { type: 'input', name: 'slug', message: 'Slug (leave empty to auto-generate):' },
      { type: 'input', name: 'tags', message: 'Tags (comma separated):' },
      { type: 'input', name: 'date', message: 'Date (YYYY-MM-DD, leave empty for today):' }
    ]);

    const slug = answers.slug || getSlug(answers.title);
    const date = answers.date || new Date().toISOString().split('T')[0];
    const tags = answers.tags.split(',').map(t => t.trim()).filter(Boolean);

    const content = `---
title: "${answers.title}"
date: "${date}"
description: "TODO: Add description"
tags: [${tags.map(t => `"${t}"`).join(', ')}]
---

Write your content here...
`;

    const filePath = path.join(BLOGS_DIR, `${slug}.md`);
    if (fs.existsSync(filePath)) {
      console.error(chalk.red('Error: Blog with this slug already exists!'));
      return;
    }

    fs.writeFileSync(filePath, content);
    console.log(chalk.green(`Blog created at: ${filePath}`));
  });

const projectCmd = program.command('project').description('Manage projects');

projectCmd
  .command('create')
  .description('Create a new project')
  .action(async () => {
    const answers = await inquirer.prompt([
      { type: 'input', name: 'title', message: 'Project Title:' },
      { type: 'input', name: 'slug', message: 'Slug (leave empty to auto-generate):' },
      { type: 'input', name: 'summary', message: 'Summary (One liner):' },
      { type: 'editor', name: 'description', message: 'Description (Markdown supported!):' },
      { type: 'list', name: 'status', message: 'Status:', choices: ['Ongoing', 'Completed', 'On Hold', 'Idea'] },
    ]);

    const slug = answers.slug || getSlug(answers.title);
    const projectPath = path.join(PROJECTS_DIR, slug);

    if (fs.existsSync(projectPath)) {
      console.error(chalk.red('Error: Project folder already exists!'));
      return;
    }

    fs.mkdirSync(projectPath, { recursive: true });
    fs.mkdirSync(path.join(projectPath, 'devlogs'), { recursive: true });

    const metadata = {
        title: answers.title,
        summary: answers.summary,
        description: answers.description,
        tags: [],
        status: answers.status,
        repoLink: "",
        demoLink: ""
    };

    fs.writeFileSync(path.join(projectPath, 'project-metadata.yaml'), yaml.dump(metadata));
    
    const order = loadProjectOrder();
    if (!order.includes(slug)) {
        order.push(slug);
        saveProjectOrder(order);
    }

    console.log(chalk.green(`Project created at: ${projectPath}`));
  });

projectCmd
  .command('order')
  .description('Order projects interactively')
  .action(async () => {
    const currentOrder = loadProjectOrder();
    const allFolders = getCurrentProjects();
    const uniqueProjects = [...new Set([...currentOrder, ...allFolders])].filter(p => allFolders.includes(p));

    // Prepare text for editor
    const editorContent = uniqueProjects.map(slug => {
      const meta = getProjectMetadata(slug);
      const title = meta ? meta.title : 'Unknown';
      return `${slug} # ${title}`;
    }).join('\n');

    const tempFile = path.join(os.tmpdir(), 'portfolio-project-order.txt');
    fs.writeFileSync(tempFile, 
`# Reorder lines to change project order.
# Lines starting with # are comments (except inline comments).
# Format: slug # Optional Title/Comment
${editorContent}`
    );

    // Open editor
    const editor = process.env.EDITOR || 'vim';
    
    console.log(chalk.blue(`Opening ${tempFile} in ${editor}...`));
    
    const child = spawn(editor, [tempFile], {
        stdio: 'inherit'
    });

    child.on('exit', (code) => {
        if (code !== 0) {
            console.error(chalk.red('Editor exited with error code.'));
            return;
        }

        const newContent = fs.readFileSync(tempFile, 'utf8');
        const newOrder = newContent
            .split('\n')
            .map(line => line.trim())
            .filter(line => line && !line.startsWith('#')) // Remove comments/empty
            .map(line => line.split('#')[0].trim()); // Get slug

        const validOrder = newOrder.filter(slug => allFolders.includes(slug));
        
        const missing = allFolders.filter(slug => !validOrder.includes(slug));
        if (missing.length > 0) {
            console.log(chalk.yellow(`Warning: Some projects were missing from the order list, apppending them: ${missing.join(', ')}`));
            validOrder.push(...missing);
        }

        saveProjectOrder(validOrder);
        console.log(chalk.green('Project order updated!'));
        fs.unlinkSync(tempFile);
    });
  });

const devlogCmd = program.command('devlog').description('Manage devlogs');

devlogCmd
  .command('create')
  .description('Create a new devlog')
  .action(async () => {
    const projects = loadProjectOrder();
    const existing = getCurrentProjects();
    const choices = projects.filter(p => existing.includes(p)).map(slug => {
        const meta = getProjectMetadata(slug);
        return {
            name: meta ? `${meta.title} (${slug})` : slug,
            value: slug
        };
    });

    const { projectSlug } = await inquirer.prompt([
        {
            type: 'autocomplete',
            name: 'projectSlug',
            message: 'Select Project:',
            source: async (answers, input) => {
                const term = input || '';
                return choices.filter(c => c.name.toLowerCase().includes(term.toLowerCase()));
            }
        }
    ]);

    const { title, timeSpent } = await inquirer.prompt([
        { type: 'input', name: 'title', message: 'Devlog Title:' },
        { type: 'input', name: 'timeSpent', message: 'Time Spent (hours, e.g. 2.5):', validate: val => !isNaN(parseFloat(val)) || 'Please enter a number' }
    ]);

    // Calculate Order
    const devlogsDir = path.join(PROJECTS_DIR, projectSlug, 'devlogs');
    if (!fs.existsSync(devlogsDir)) {
        fs.mkdirSync(devlogsDir, { recursive: true });
    }

    const files = fs.readdirSync(devlogsDir).filter(f => f.endsWith('.md'));
    let maxOrder = 0;
    
    files.forEach(f => {
        const content = fs.readFileSync(path.join(devlogsDir, f), 'utf8');
        try {
            const parsed = matter(content);
            
                const ord = parseFloat(parsed.data.order);
                if (ord > maxOrder) maxOrder = ord;

        } catch(e) {}
    });

    const newOrder = Math.floor(maxOrder) + 1;
    const slug = getSlug(title);
    const date = new Date().toISOString().split('T')[0];

    const content = `---
title: "${title}"
date: "${date}"
time-spent: ${parseFloat(timeSpent)}
order: ${newOrder}
---

Write your devlog here...
`;
    
    const filePath = path.join(devlogsDir, `${slug}.md`);
    fs.writeFileSync(filePath, content);
    console.log(chalk.green(`Devlog created: ${filePath} (Order: ${newOrder})`));
  });

program.parse();
