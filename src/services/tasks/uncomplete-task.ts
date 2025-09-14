import { getTodoistClient } from '../client';

export async function uncompleteTask(taskId: string): Promise<void> {
  const client = getTodoistClient();

  try {
    await client.post!(`/tasks/${taskId}/reopen`);
  } catch (error) {
    throw new Error(`Failed to uncomplete task: ${getErrorMessage(error)}`);
  }
}

function getErrorMessage(error: any): string {
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  return error instanceof Error ? error.message : 'Unknown error';
}
