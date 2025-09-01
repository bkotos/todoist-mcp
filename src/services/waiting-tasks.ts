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

// Define the filter query for better readability
const WAITING_FILTER = '#Waiting | #Brian waiting | #Ansonia Waiting';

// Get error message
function getErrorMessage(error: any): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.error || error.message;
  }
  return error instanceof Error ? error.message : 'Unknown error';
}

// Get waiting tasks function - returns structured data for waiting tasks
export async function getWaitingTasks(): Promise<TasksResponse> {
  const todoistClient = getTodoistClient();

  try {
    const response = await todoistClient.get<TodoistTask[]>(
      `/tasks?filter=${encodeURIComponent(WAITING_FILTER)}`
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
    throw new Error(`Failed to get waiting tasks: ${getErrorMessage(error)}`);
  }
}

// Export types for testing
export type { TodoistTask, TasksResponse };
