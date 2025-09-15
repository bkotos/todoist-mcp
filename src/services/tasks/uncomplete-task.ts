import { getTodoistClient } from '../client';
import { getErrorMessage } from '../../utils';

export async function uncompleteTask(taskId: string): Promise<void> {
  const client = getTodoistClient();

  try {
    await client.post!(`/tasks/${taskId}/reopen`);
  } catch (error) {
    throw new Error(`Failed to uncomplete task: ${getErrorMessage(error)}`);
  }
}
