import { moveTask } from '../services/tasks/task-update';
import type { Tool } from './types';

// Single tool object that implements the Tool interface
export const moveTaskTool: Tool = {
  schema: {
    name: 'move_task',
    description: 'Move a task from one project to another',
    inputSchema: {
      type: 'object',
      properties: {
        task_id: {
          type: 'string',
          description: 'The task ID to move',
        },
        project_id: {
          type: 'string',
          description: 'The project ID to move the task to',
        },
      },
      required: ['task_id', 'project_id'],
    },
  },
  handler: async (args: {
    task_id: string;
    project_id: string;
  }): Promise<{
    content: Array<{
      type: 'text';
      text: string;
    }>;
  }> => {
    console.error('Executing move_task...');
    const { task_id, project_id } = args;

    if (!task_id) {
      throw new Error('task_id is required');
    }

    if (!project_id) {
      throw new Error('project_id is required');
    }

    try {
      await moveTask(task_id, project_id);
      console.error('move_task completed successfully');

      return {
        content: [
          {
            type: 'text',
            text: `Task ${task_id} successfully moved to project ${project_id}`,
          },
        ],
      };
    } catch (error) {
      console.error('move_task error:', error);
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${
              error instanceof Error ? error.message : 'Unknown error'
            }`,
          },
        ],
      };
    }
  },
};
