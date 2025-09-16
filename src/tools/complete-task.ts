import { completeTask } from '../services/tasks/task-update';
import type { Tool } from './types';

// Single tool object that implements the Tool interface
export const completeTaskTool: Tool = {
  schema: {
    name: 'complete_task',
    description: 'Complete a task by its ID',
    inputSchema: {
      type: 'object',
      properties: {
        task_id: {
          type: 'string',
          description: 'The ID of the task to complete',
        },
      },
      required: ['task_id'],
    },
  },
  handler: async (args: { task_id: string }) => {
    try {
      const result = await completeTask(args.task_id);
      return {
        content: [
          {
            type: 'text',
            text: result,
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
