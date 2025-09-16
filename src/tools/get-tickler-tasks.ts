import { getTicklerTasks } from '../services/tasks/task-retrieval';
import type { Tool } from './types';

// Single tool object that implements the Tool interface
export const getTicklerTasksTool: Tool = {
  schema: {
    name: 'get_tickler_tasks',
    description:
      'Get all tickler tasks that are due today or overdue from Todoist. Tickler tasks are tasks with labels #Tickler, #Ansonia Tickler, or #Brian tickler. Returns structured JSON data with task details including id, content, description, completion status, labels, priority, due date, and comment count.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  handler: async () => {
    console.error('Executing get_tickler_tasks...');
    const result = await getTicklerTasks();
    console.error('get_tickler_tasks completed successfully');
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
