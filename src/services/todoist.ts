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

interface TodoistTask {
  id: string;
  project_id: string;
  content: string;
  description: string;
  is_completed: boolean;
  labels: string[];
  priority: number;
  due: {
    date: string;
    string: string;
    lang: string;
    is_recurring: boolean;
  } | null;
  url: string;
  comment_count: number;
  created_at: string;
  updated_at: string;
}

interface TasksResponse {
  tasks: Array<{
    id: number;
    content: string;
    description: string;
    is_completed: boolean;
    labels: string[];
    priority: number;
    due_date: string | null;
    url: string;
    comment_count: number;
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

// List tasks in project function - returns structured data for tasks in a specific project
export async function listTasksInProject(
  projectId: string
): Promise<TasksResponse> {
  const todoistClient = getTodoistClient();

  try {
    const response = await todoistClient.get<TodoistTask[]>(
      `/tasks?project_id=${projectId}`
    );
    const tasks = response.data.map((task) => ({
      id: parseInt(task.id),
      content: task.content,
      description: task.description,
      is_completed: task.is_completed,
      labels: task.labels,
      priority: task.priority,
      due_date: task.due?.date || null,
      url: task.url,
      comment_count: task.comment_count,
    }));

    return {
      tasks,
      total_count: tasks.length,
    };
  } catch (error) {
    throw new Error(
      `Failed to list tasks in project: ${getErrorMessage(error)}`
    );
  }
}

// Export types for testing
export type { TodoistProject, ProjectsResponse, TodoistTask, TasksResponse };
