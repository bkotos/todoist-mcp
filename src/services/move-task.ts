import axios from 'axios';
import { getTodoistV1Client } from './client';

interface IdMappingResponse {
  id: string;
}

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
  const client = getTodoistV1Client();

  try {
    // Convert v2 task ID to v1 format
    const taskIdMappingResponse = await client.get<IdMappingResponse>(
      `/api/v1/id_mappings/tasks/${taskId}`
    );
    const v1TaskId = taskIdMappingResponse.data.id;

    // Convert v2 project ID to v1 format
    const projectIdMappingResponse = await client.get<IdMappingResponse>(
      `/api/v1/id_mappings/projects/${projectId}`
    );
    const v1ProjectId = projectIdMappingResponse.data.id;

    // Move the task using v1 API
    await client.post(`/api/v1/tasks/${v1TaskId}/move`, {
      project_id: v1ProjectId,
    });
  } catch (error) {
    throw new Error(`Failed to move task: ${getErrorMessage(error)}`);
  }
}
