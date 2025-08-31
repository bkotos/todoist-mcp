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

interface TaskUpdatePayload {
  content?: string;
  description?: string;
  labels?: string[];
  priority?: number;
  due_date?: string;
  project_id?: string;
}

function extractErrorMessage(error: any): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.error || error.message;
  }
  return error instanceof Error ? error.message : 'Unknown error';
}

function createErrorWithContext(context: string, error: any): Error {
  const errorMessage = extractErrorMessage(error);
  return new Error(`${context}: ${errorMessage}`);
}

async function retrieveOldTaskTitle(
  taskId: string
): Promise<string | undefined> {
  try {
    return await getTaskName(taskId);
  } catch (error) {
    throw createErrorWithContext('Failed to get old task title', error);
  }
}

function buildUpdatePayload(params: UpdateTaskParams): TaskUpdatePayload {
  const payload: TaskUpdatePayload = {};

  if (params.title) {
    payload.content = params.title;
  }

  if (params.description) {
    payload.description = params.description;
  }

  if (params.labels) {
    payload.labels = params.labels;
  }

  if (params.priority !== undefined) {
    payload.priority = params.priority;
  }

  if (params.dueDate) {
    payload.due_date = params.dueDate;
  }

  if (params.projectId) {
    payload.project_id = params.projectId;
  }

  return payload;
}

function validateClientPostMethod(client: any): void {
  if (client.post) {
    return;
  }
  throw new Error('POST method not available on client');
}

async function performTaskUpdate(
  client: any,
  taskId: string,
  payload: TaskUpdatePayload
): Promise<void> {
  validateClientPostMethod(client);
  await client.post(`/tasks/${taskId}`, payload);
}

async function handleTaskRename(
  taskId: string,
  oldTitle: string,
  newTitle: string
): Promise<void> {
  try {
    await addTaskRenameComment(taskId, oldTitle, newTitle);
    setTaskName(taskId, newTitle);
  } catch (error) {
    throw createErrorWithContext('Failed to create rename comment', error);
  }
}

export async function updateTask(params: UpdateTaskParams): Promise<string> {
  const client = getTodoistClient();

  try {
    const oldTitle = params.title
      ? await retrieveOldTaskTitle(params.taskId)
      : undefined;

    const updatePayload = buildUpdatePayload(params);
    await performTaskUpdate(client, params.taskId, updatePayload);

    if (params.title && oldTitle) {
      await handleTaskRename(params.taskId, oldTitle, params.title);
    }

    return 'Task updated successfully';
  } catch (error) {
    throw createErrorWithContext('Failed to update task', error);
  }
}
