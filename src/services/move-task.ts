import axios from 'axios';
import { getTodoistV1Client } from './client';
import { convertV2IdToV1 } from './id-mapping';

// Get error message
function getErrorMessage(error: any): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.error || error.message;
  }
  return error instanceof Error ? error.message : 'Unknown error';
}

/**
 * Move a task from one project to another
 * @param taskId - The v2 format task ID
 * @param projectId - The v2 format project ID to move the task to
 */
export async function moveTask(
  taskId: string,
  projectId: string
): Promise<void> {
  try {
    // Convert v2 IDs to v1 format
    const v1TaskId = await convertV2IdToV1('tasks', taskId);
    const v1ProjectId = await convertV2IdToV1('projects', projectId);

    // Move the task using v1 API
    const client = getTodoistV1Client();
    await client.post(`/api/v1/tasks/${v1TaskId}/move`, {
      project_id: v1ProjectId,
    });
  } catch (error) {
    throw new Error(`Failed to move task: ${getErrorMessage(error)}`);
  }
}
