import { getTodoistClient } from './client';
import axios from 'axios';
import { getTaskName, setTaskName } from './task-cache';
import { addTaskRenameComment } from './comments';

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
    // If title is being updated, get the old title from cache first
    let oldTitle: string | undefined;
    if (params.title !== undefined) {
      try {
        oldTitle = await getTaskName(params.taskId);
      } catch (error) {
        throw new Error(
          `Failed to get old task title: ${getErrorMessage(error)}`
        );
      }
    }

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

    // If title was updated, create a rename comment and update cache
    if (params.title !== undefined && oldTitle) {
      try {
        await addTaskRenameComment(params.taskId, oldTitle, params.title);
        setTaskName(params.taskId, params.title);
      } catch (error) {
        throw new Error(
          `Failed to create rename comment: ${getErrorMessage(error)}`
        );
      }
    }

    return 'Task updated successfully';
  } catch (error) {
    throw new Error(`Failed to update task: ${getErrorMessage(error)}`);
  }
}
