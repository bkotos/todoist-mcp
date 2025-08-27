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

// Format projects list
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

// List projects function
export async function listProjects(): Promise<string> {
  const todoistClient = getTodoistClient();

  try {
    const response = await todoistClient.get<TodoistProject[]>('/projects');
    return formatProjectsList(response.data);
  } catch (error) {
    throw new Error(`Failed to list projects: ${getErrorMessage(error)}`);
  }
}

// Export types for testing
export type { TodoistProject };
