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

function getErrorMessage(error: any): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.error || error.message;
  }
  return error instanceof Error ? error.message : 'Unknown error';
}

export async function getTicklerTasks(): Promise<TodoistTask[]> {
  const client = getTodoistClient();

  try {
    const filter =
      '(today | overdue) & (#Tickler | #Ansonia Tickler | #Brian tickler)';
    const response = await client.get<TodoistTask[]>(
      `/tasks?filter=${encodeURIComponent(filter)}`
    );
    return response.data;
  } catch (error) {
    throw new Error(`Failed to get tickler tasks: ${getErrorMessage(error)}`);
  }
}
