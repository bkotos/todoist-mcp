import { getTodoistClient, getTodoistV1Client } from '../client';
import { getTaskById } from './task-retrieval';
import { listProjects } from '../projects/projects';
import { isBrianSharedProject, getErrorMessage } from '../../utils';
import { getTaskName, setTaskName } from '../cache/task-cache';
import { addTaskRenameComment, createAutomatedTaskComment } from './comments';
import { convertV2IdToV1 } from '../id-mapping';

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

export interface UpdateTaskParams {
  taskId: string;
  title?: string;
  description?: string;
  labels?: string[];
  priority?: number;
  dueString?: string;
}

interface TaskUpdatePayload {
  content?: string;
  description?: string;
  labels?: string[];
  priority?: number;
  due_string?: string;
  project_id?: string;
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

async function retrieveOldTaskTitle(
  taskId: string
): Promise<string | undefined> {
  try {
    return await getTaskName(taskId);
  } catch (error) {
    throw new Error(`Failed to get old task title: ${getErrorMessage(error)}`);
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

  if (params.dueString) {
    payload.due_string = params.dueString;
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
    throw new Error(
      `Failed to create rename comment: ${getErrorMessage(error)}`
    );
  }
}

async function throwIfTaskIsFromBecky(taskId: string): Promise<void> {
  const task = await getTaskById(taskId);
  const projects = await listProjects();
  const project = projects.projects.find((p) => p.id === task.project_id);

  if (project && isBrianSharedProject(project)) {
    throw new Error(
      'This task is in a Brian shared project. Please use the tool for completing Becky tasks instead.'
    );
  }
}

// Helper function to find project by name
async function findProjectByName(projectName: string): Promise<string> {
  const projects = await listProjects();
  const project = projects.projects.find((p) => p.name === projectName);

  if (!project) {
    throw new Error(`Project "${projectName}" not found`);
  }

  return project.id.toString();
}

// Helper function to build the comment content
function buildCommentContent(): string {
  return `I finished this task. If it looks good to you, please mark as complete. Otherwise, put back in my inbox.`;
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
    throw new Error(`Failed to update task: ${getErrorMessage(error)}`);
  }
}

export async function completeTask(taskId: string): Promise<string> {
  const client = getTodoistClient();

  try {
    // Check if task is in a Brian shared project
    await throwIfTaskIsFromBecky(taskId);

    if (!client.post) {
      throw new Error('POST method not available on client');
    }

    await client.post(`/tasks/${taskId}/close`);
    return 'Task completed successfully';
  } catch (error) {
    throw new Error(`Failed to complete task: ${getErrorMessage(error)}`);
  }
}

/**
 * Complete a task assigned to Brian from Becky by:
 * 1. Setting the due date to today
 * 2. Adding a comment about completion
 * 3. Moving the task to "Becky inbox - per Brian" project
 */
export async function completeBeckyTask(taskId: string): Promise<void> {
  try {
    const commentContent = buildCommentContent();

    // Find the Becky inbox project
    const beckyInboxProjectId = await findProjectByName(
      'Becky inbox - per Brian'
    );

    // Update the task due string to today
    await updateTask({
      taskId,
      dueString: 'today',
    });

    // Add the completion comment
    await createAutomatedTaskComment(taskId, commentContent);

    // Move the task to the Becky inbox project
    await moveTask(taskId, beckyInboxProjectId);
  } catch (error) {
    throw new Error(`Failed to complete Becky task: ${getErrorMessage(error)}`);
  }
}

export async function uncompleteTask(taskId: string): Promise<void> {
  const client = getTodoistClient();

  try {
    await client.post!(`/tasks/${taskId}/reopen`);
  } catch (error) {
    throw new Error(`Failed to uncomplete task: ${getErrorMessage(error)}`);
  }
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
