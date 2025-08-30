import { getTodoistClient } from './client';
import axios from 'axios';

export interface UpdateTaskParams {
  taskId: string;
  title?: string;
  description?: string;
  labels?: string[];
  priority?: number;
  dueDate?: string;
  projectId?: string;
}

// Get error message helper function
function getErrorMessage(error: any): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.error || error.message;
  }
  return error instanceof Error ? error.message : 'Unknown error';
}

export async function updateTask(params: UpdateTaskParams): Promise<string> {
  const client = getTodoistClient();

  try {
    // Build update payload with only provided fields
    const updatePayload: any = {};

    if (params.title !== undefined) {
      updatePayload.content = params.title;
    }

    if (params.description !== undefined) {
      updatePayload.description = params.description;
    }

    if (params.labels !== undefined) {
      updatePayload.labels = params.labels;
    }

    if (params.priority !== undefined) {
      updatePayload.priority = params.priority;
    }

    if (params.dueDate !== undefined) {
      updatePayload.due_date = params.dueDate;
    }

    if (params.projectId !== undefined) {
      updatePayload.project_id = params.projectId;
    }

    if (!client.post) {
      throw new Error('POST method not available on client');
    }

    await client.post(`/tasks/${params.taskId}`, updatePayload);

    return 'Task updated successfully';
  } catch (error) {
    throw new Error(`Failed to update task: ${getErrorMessage(error)}`);
  }
}
