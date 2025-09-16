import { getTasksWithLabel } from '../services/tasks/task-retrieval';
import type { Tool } from './types';

// Single tool object that implements the Tool interface
export const getTasksWithLabelTool: Tool = {
  schema: {
    name: 'get_tasks_with_label',
    description:
      'Get all tasks with a specific label that are not part of the "Brian projects" or "Projects" projects. Returns structured JSON data with task details including id, content, description, completion status, labels, priority, due date, and comment count.',
    inputSchema: {
      type: 'object',
      properties: {
        label: {
          type: 'string',
          description:
            'The label to filter tasks by (e.g., "urgent", "important", "work")',
        },
      },
      required: ['label'],
    },
  },
  handler: async (args: { label: string }) => {
    console.error('Executing get_tasks_with_label...');
    const result = await getTasksWithLabel(args.label);
    console.error('get_tasks_with_label completed successfully');
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  },
};
