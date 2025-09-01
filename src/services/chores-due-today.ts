import { getTodoistClient } from './client';

interface TodoistTask {
  id: string;
  content: string;
  due?: { date: string };
  project_id: string;
  labels: string[];
}

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
