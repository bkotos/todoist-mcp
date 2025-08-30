import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { getTodoistClient } from './client';

interface TodoistProject {
  id: string;
  name: string;
  color: string;
  parent_id?: string;
  order: number;
  comment_count: number;
  is_shared: boolean;
  is_favorite: boolean;
  is_inbox_project: boolean;
  is_team_inbox: boolean;
  view_style: string;
  url: string;
  created_at: string;
  updated_at: string;
}

interface ProjectsResponse {
  projects: Array<{
    id: number;
    name: string;
    url: string;
    is_favorite: boolean;
    is_inbox: boolean;
  }>;
  total_count: number;
}

// Get error message
function getErrorMessage(error: any): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.error || error.message;
  }
  return error instanceof Error ? error.message : 'Unknown error';
}

// Helper function to get cache configuration
function getCacheConfig() {
  const CACHE_DIR = '.cache';
  const CACHE_FILE = path.join(CACHE_DIR, 'projects.json');
  const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 1 day

  return { CACHE_DIR, CACHE_FILE, CACHE_DURATION_MS };
}

// Helper function to ensure cache directory exists
function ensureCacheDirectory(): void {
  const { CACHE_DIR } = getCacheConfig();
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
}

// Helper function to check if cache file is fresh (less than 1 day old)
function isCacheFresh(): boolean {
  const { CACHE_FILE, CACHE_DURATION_MS } = getCacheConfig();

  if (!fs.existsSync(CACHE_FILE)) {
    return false;
  }

  const fileStats = fs.statSync(CACHE_FILE);
  return Date.now() - fileStats.mtime.getTime() < CACHE_DURATION_MS;
}

// Helper function to read cached data
function readCachedData(): (ProjectsResponse & { cached_at?: string }) | null {
  const { CACHE_FILE } = getCacheConfig();

  try {
    const cachedData = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
    return cachedData;
  } catch (cacheError) {
    console.warn('Failed to read cache file, falling back to API:', cacheError);
    return null;
  }
}

// Helper function to write data to cache
function writeToCache(data: ProjectsResponse & { cached_at?: string }): void {
  const { CACHE_FILE } = getCacheConfig();
  fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2));
}

// Helper function to transform Todoist projects to our format
function transformProjects(projects: TodoistProject[]): ProjectsResponse {
  const transformedProjects = projects.map((project) => ({
    id: parseInt(project.id),
    name: project.name,
    url: project.url,
    is_favorite: project.is_favorite,
    is_inbox: project.is_inbox_project,
  }));

  return {
    projects: transformedProjects,
    total_count: transformedProjects.length,
  };
}

// Helper function to fetch projects from API
async function fetchProjectsFromAPI(): Promise<ProjectsResponse> {
  const todoistClient = getTodoistClient();
  const apiResponse = await todoistClient.get<TodoistProject[]>('/projects');
  return transformProjects(apiResponse.data);
}

// Helper function to create result with cache timestamp
function createCachedResult(
  projectsData: ProjectsResponse
): ProjectsResponse & { cached_at: string } {
  return {
    ...projectsData,
    cached_at: new Date().toISOString(),
  };
}

// Helper function to try reading from cache
function tryReadFromCache():
  | (ProjectsResponse & { cached_at?: string })
  | null {
  if (isCacheFresh()) {
    return readCachedData();
  }
  return null;
}

// List projects function with caching - returns structured data
export async function listProjects(): Promise<
  ProjectsResponse & { cached_at?: string }
> {
  try {
    ensureCacheDirectory();

    const cachedData = tryReadFromCache();
    if (cachedData) {
      return cachedData;
    }

    const projectsData = await fetchProjectsFromAPI();
    const result = createCachedResult(projectsData);

    writeToCache(result);
    return result;
  } catch (error) {
    throw new Error(`Failed to list projects: ${getErrorMessage(error)}`);
  }
}

// Export types for testing
export type { TodoistProject, ProjectsResponse };
