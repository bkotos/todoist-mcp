import axios from 'axios';
import { getTodoistClient } from './client';
import {
  ensureCacheDirectory,
  tryReadFromCache,
  createCachedResult,
  writeToCache,
} from '../cache/project-cache';

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
