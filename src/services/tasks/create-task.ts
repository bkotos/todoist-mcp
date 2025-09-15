import { getTodoistClient } from '../client';
import { getErrorMessage } from '../../utils';

export interface CreateTaskParams {
  title: string;
  description?: string;
  projectId?: string;
  labels?: string[];
  priority?: number;
  dueDate?: string;
}

interface TaskCreatePayload {
  content: string;
  description?: string;
  project_id?: string;
  labels?: string[];
  priority?: number;
  due_date?: string;
}

function buildCreatePayload(params: CreateTaskParams): TaskCreatePayload {
  const payload: TaskCreatePayload = {
    content: params.title,
  };

  if (params.description) {
    payload.description = params.description;
  }

  if (params.projectId) {
    payload.project_id = params.projectId;
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

  return payload;
}

export async function createTask(params: CreateTaskParams): Promise<string> {
  const client = getTodoistClient();

  try {
    const createPayload = buildCreatePayload(params);

    if (!client.post) {
      throw new Error('POST method not available on client');
    }

    const response = await client.post<{ content: string }>(
      '/tasks',
      createPayload
    );

    return `Task created successfully: ${response.data.content}`;
  } catch (error) {
    throw new Error(`Failed to create task: ${getErrorMessage(error)}`);
  }
}
