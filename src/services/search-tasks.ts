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

// Search tasks function - returns structured data for tasks matching the search query
// Supports Todoist search syntax:
// - Basic search: search:meeting
// - Wildcards: search:*report*
// - Exact phrases: search:"buy groceries"
export async function searchTasks(query: string): Promise<TasksResponse> {
  if (!query.trim()) {
    throw new Error('Search query cannot be empty');
  }

  const todoistClient = getTodoistClient();

  try {
    const response = await todoistClient.get<TodoistTask[]>(
      `/tasks?filter=${encodeURIComponent(`search:${query}`)}`
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
  } catch (error) {
    throw new Error(`Failed to search tasks: ${getErrorMessage(error)}`);
  }
}
