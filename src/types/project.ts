export interface Project {
  slug: string;
  title: string;
  summary?: string;
  description: string;
  tags: string[];
  status: 'In Progress' | 'Completed' | 'On Hold' | 'Idea';
  thumbnail: string;
  demoLink?: string;
  repoLink?: string;
  devlogCount: number;
  totalTimeSpent?: number;
  path: string;
}
