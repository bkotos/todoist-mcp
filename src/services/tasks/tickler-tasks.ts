import { getTodoistClient } from '../client';
import { TodoistTask } from '../../types';
import { getErrorMessage } from '../../utils';

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
