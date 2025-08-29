import { listInboxTasks } from '../services/todoist';

export const listInboxTasksSchema = {
  name: 'list_inbox_tasks',
  description:
    'List all inbox tasks from Todoist using a specific filter. Returns structured JSON data with task details including id, content, description, completion status, labels, priority, due date, and comment count.',
  inputSchema: {
    type: 'object',
    properties: {},
    required: [],
  },
};

export const listInboxTasksHandler = async () => {
  console.error('Executing list_inbox_tasks...');
  const result = await listInboxTasks();
  console.error('list_inbox_tasks completed successfully');
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(result, null, 2),
      },
    ],
  };
};
