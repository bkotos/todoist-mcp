import { uncompleteTask } from '../services/tasks/task-update';

export const uncompleteTaskSchema = {
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
};

export async function uncompleteTaskHandler(args: {
  task_id: string;
}): Promise<{ content: Array<{ type: string; text: string }> }> {
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
}
