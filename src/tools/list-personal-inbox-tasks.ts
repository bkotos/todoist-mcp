import { listPersonalInboxTasks } from '../services/tasks/task-retrieval';
import type { Tool } from './types';

// Single tool object that implements the Tool interface
export const listPersonalInboxTasksTool: Tool = {
  schema: {
    name: 'list_personal_inbox_tasks',
    description:
      'List all personal inbox tasks from Todoist using the ##Inbox filter. Returns structured JSON data with task details including id, content, description, completion status, labels, priority, due date, and comment count.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  handler: async () => {
    console.error('Executing list_personal_inbox_tasks...');
    const result = await listPersonalInboxTasks();
    console.error('list_personal_inbox_tasks completed successfully');
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
