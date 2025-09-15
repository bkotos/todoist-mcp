import { completeBeckyTask } from '../services/tasks/task-update';

export const completeBeckyTaskSchema = {
  name: 'complete_becky_task',
  description:
    'Complete a Brian shared task (assigned to Brian from Becky) by setting due date to today, adding a completion comment, and moving it to Becky inbox project',
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

export async function completeBeckyTaskHandler(args: {
  task_id: string;
}): Promise<{ content: Array<{ type: string; text: string }> }> {
  try {
    console.error('Executing complete_becky_task...');
    await completeBeckyTask(args.task_id);
    console.error('complete_becky_task completed successfully');

    return {
      content: [
        {
          type: 'text',
          text: 'Task completed successfully. Due date set to today, completion comment added, and task moved to Becky inbox project.',
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
