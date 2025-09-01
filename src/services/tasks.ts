import axios from 'axios';
import { getTodoistClient } from './client';
import { setTaskName } from './task-cache';

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

  // Store task names in cache
  tasks.forEach((task) => {
    setTaskName(task.id.toString(), task.content);
  });

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

// List next actions function - returns structured data for next actions tasks
export async function listNextActions(): Promise<TasksResponse> {
  try {
    return await fetchTasksByFilter(
      '(##Next actions | ##Brian acknowledged) & !subtask'
    );
  } catch (error) {
    throw new Error(`Failed to list next actions: ${getErrorMessage(error)}`);
  }
}

// Get task by id function - returns a single task by its ID
export async function getTaskById(taskId: string): Promise<TodoistTask> {
  const todoistClient = getTodoistClient();

  try {
    const response = await todoistClient.get<TodoistTask>(`/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to get task by id: ${getErrorMessage(error)}`);
  }
}

// Get tasks with specific label function - returns tasks with label excluding Brian projects and Projects
export async function getTasksWithLabel(label: string): Promise<TasksResponse> {
  try {
    return await fetchTasksByFilter(
      `@${label} & !##Brian projects & !##Projects`
    );
  } catch (error) {
    throw new Error(
      `Failed to get tasks with label: ${getErrorMessage(error)}`
    );
  }
}

// Get tasks from Areas of focus project function - returns structured data for Areas of focus tasks
export async function getAreasOfFocus(): Promise<TasksResponse> {
  try {
    return await fetchTasksByFilter('##Areas of focus');
  } catch (error) {
    throw new Error(
      `Failed to get tasks from Areas of focus project: ${getErrorMessage(
        error
      )}`
    );
  }
}

// Export types for testing
export type { TodoistTask, TasksResponse };
