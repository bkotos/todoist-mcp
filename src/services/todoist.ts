import axios from 'axios';
import { getTodoistClient, TodoistClient } from './client';

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

// Format projects list (keeping for backward compatibility if needed)
function formatProjectsList(projects: TodoistProject[]): string {
  if (projects.length === 0) {
    return 'No projects found.';
  }

  const formattedProjects = projects
    .map((project) => {
      const inboxIndicator = project.is_inbox_project ? ' 📥' : '';
      const favoriteIndicator = project.is_favorite ? ' ⭐' : '';
      return `**${project.name}** (ID: ${project.id})${inboxIndicator}${favoriteIndicator}\n🔗 URL: ${project.url}`;
    })
    .join('\n\n');

  return `Found ${projects.length} project(s):\n\n${formattedProjects}`;
}

// Get error message
function getErrorMessage(error: any): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.error || error.message;
  }
  return error instanceof Error ? error.message : 'Unknown error';
}

// List projects function - returns structured data
export async function listProjects(): Promise<ProjectsResponse> {
  const todoistClient = getTodoistClient();

  try {
    const response = await todoistClient.get<TodoistProject[]>('/projects');
    const projects = response.data.map((project) => ({
      id: parseInt(project.id),
      name: project.name,
      url: project.url,
      is_favorite: project.is_favorite,
      is_inbox: project.is_inbox_project,
    }));

    return {
      projects,
      total_count: projects.length,
    };
  } catch (error) {
    throw new Error(`Failed to list projects: ${getErrorMessage(error)}`);
  }
}

// List inbox projects function - returns structured data for specific inbox projects
export async function listInboxProjects(): Promise<ProjectsResponse> {
  const todoistClient = getTodoistClient();

  try {
    const response = await todoistClient.get<TodoistProject[]>('/projects');
    const inboxProjectNames = [
      'Inbox',
      'Brian inbox - per Becky',
      'Becky inbox - per Brian',
    ];

    const inboxProjects = response.data
      .filter((project) => inboxProjectNames.includes(project.name))
      .map((project) => ({
        id: parseInt(project.id),
        name: project.name,
        url: project.url,
        is_favorite: project.is_favorite,
        is_inbox: project.is_inbox_project,
      }));

    return {
      projects: inboxProjects,
      total_count: inboxProjects.length,
    };
  } catch (error) {
    throw new Error(`Failed to list inbox projects: ${getErrorMessage(error)}`);
  }
}

// Export types for testing
export type { TodoistProject, ProjectsResponse };
