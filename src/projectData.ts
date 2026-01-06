import type { Project } from './types/project';

let cachedProjects: Project[] | null = null;
let fetchPromise: Promise<Project[]> | null = null;

export async function fetchAllProjects(): Promise<Project[]> {
  if (cachedProjects) return cachedProjects;
  if (fetchPromise) return fetchPromise;

  fetchPromise = fetch('/projects.manifest.json')
    .then(res => res.json())
    .then(data => {
      cachedProjects = data;
      return data;
    })
    .catch(err => {
      console.error(err);
      return [];
    });
  
  return fetchPromise;
}
