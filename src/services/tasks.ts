import axios from 'axios';
import { getTodoistClient } from './client';

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

// Get error message
function getErrorMessage(error: any): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.error || error.message;
  }
  return error instanceof Error ? error.message : 'Unknown error';
}

// Generic private function to fetch tasks with a specific filter
async function fetchTasksByFilter(filter: string): Promise<TasksResponse> {
  const todoistClient = getTodoistClient();
  const response = await todoistClient.get<TodoistTask[]>(
    `/tasks?filter=${encodeURIComponent(filter)}`
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
}

// List personal inbox tasks function - returns structured data for personal inbox tasks
export async function listPersonalInboxTasks(): Promise<TasksResponse> {
  try {
    return await fetchTasksByFilter('##Inbox & !subtask');
  } catch (error) {
    throw new Error(
      `Failed to list personal inbox tasks: ${getErrorMessage(error)}`
    );
  }
}

// List Brian inbox per Becky tasks function - returns structured data for Brian inbox per Becky tasks
export async function listBrianInboxPerBeckyTasks(): Promise<TasksResponse> {
  try {
    return await fetchTasksByFilter('##Brian inbox - per Becky & !subtask');
  } catch (error) {
    throw new Error(
      `Failed to list Brian inbox per Becky tasks: ${getErrorMessage(error)}`
    );
  }
}

// List Becky inbox per Brian tasks function - returns structured data for Becky inbox per Brian tasks
export async function listBeckyInboxPerBrianTasks(): Promise<TasksResponse> {
  try {
    return await fetchTasksByFilter('##Becky inbox - per Brian & !subtask');
  } catch (error) {
    throw new Error(
      `Failed to list Becky inbox per Brian tasks: ${getErrorMessage(error)}`
    );
  }
}

// Export types for testing
export type { TodoistTask, TasksResponse };
