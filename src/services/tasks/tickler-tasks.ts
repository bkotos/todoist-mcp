import axios from 'axios';
import { getTodoistClient } from '../client';
import { TodoistTask } from '../../types';

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
