import axios from 'axios';
import { getTodoistClient } from './client';

function getErrorMessage(error: any): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.error || error.message;
  }
  return error instanceof Error ? error.message : 'Unknown error';
}

export async function completeTask(taskId: string): Promise<string> {
  const client = getTodoistClient();

  try {
    if (!client.post) {
      throw new Error('POST method not available on client');
    }

    await client.post(`/tasks/${taskId}/close`);
    return 'Task completed successfully';
  } catch (error) {
    throw new Error(`Failed to complete task: ${getErrorMessage(error)}`);
  }
}
