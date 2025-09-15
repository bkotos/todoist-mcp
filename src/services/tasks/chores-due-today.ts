import { getTodoistClient } from '../client';
import { TodoistTask } from '../../types';

export async function getChoresDueToday(): Promise<TodoistTask[]> {
  const client = getTodoistClient();

  try {
    const filter = '(today | overdue) & ##Chores';
    const response = await client.get<TodoistTask[]>(
      `/tasks?filter=${encodeURIComponent(filter)}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      `Failed to get chores due today: ${getErrorMessage(error)}`
    );
  }
}

function getErrorMessage(error: any): string {
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  return error instanceof Error ? error.message : 'Unknown error';
}
