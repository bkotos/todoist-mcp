import { getTodoistClient } from '../client';
import { getTaskById } from '../tasks/tasks';
import { listProjects } from '../projects/projects';
import { isBrianSharedProject, getErrorMessage } from '../../utils';

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
