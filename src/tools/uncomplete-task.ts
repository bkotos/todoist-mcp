import { uncompleteTask } from '../services/tasks/task-update';
import type { Tool } from './types';

// Single tool object that implements the Tool interface
export const uncompleteTaskTool: Tool = {
  schema: {
    name: 'uncomplete_task',
    description: 'Uncomplete (reopen) a task by its ID',
    inputSchema: {
      type: 'object',
      properties: {
        task_id: {
          type: 'string',
          description: 'The ID of the task to uncomplete',
        },
      },
      required: ['task_id'],
    },
  },
  handler: async (args: { task_id: string }) => {
    try {
      await uncompleteTask(args.task_id);
      return {
        content: [
          {
            type: 'text',
            text: 'Task uncompleted successfully',
          },
        ],
      };
    } catch (error) {
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
