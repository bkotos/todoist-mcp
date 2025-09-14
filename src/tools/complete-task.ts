import { completeTask } from '../services/tasks/complete-task';

export const completeTaskSchema = {
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
};

export async function completeTaskHandler(args: {
  task_id: string;
}): Promise<{ content: Array<{ type: string; text: string }> }> {
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
}
