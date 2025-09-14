import axios from 'axios';
import { getTodoistClient } from './client';
import { ProjectNames } from '../utils';

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

// Define the filter query for better readability
const RECENT_MEDIA_FILTER = `##${ProjectNames.MEDIA} & !subtask & (created after: 30 days ago) & !@watched`;

// Get error message
function getErrorMessage(error: any): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.error || error.message;
  }
  return error instanceof Error ? error.message : 'Unknown error';
}

// Get recent media tasks function - returns raw JSON data for recent media tasks
export async function getRecentMedia(): Promise<TodoistTask[]> {
  const client = getTodoistClient();

  try {
    const response = await client.get<TodoistTask[]>(
      `/tasks?filter=${encodeURIComponent(RECENT_MEDIA_FILTER)}`
    );
    return response.data;
  } catch (error) {
    throw new Error(`Failed to get recent media: ${getErrorMessage(error)}`);
  }
}
