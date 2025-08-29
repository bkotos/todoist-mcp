import { listBrianInboxPerBeckyTasks } from '../services/todoist';

export const listBrianInboxPerBeckyTasksSchema = {
  name: 'list_brian_inbox_per_becky_tasks',
  description:
    'List all Brian inbox per Becky tasks from Todoist using the ##Brian inbox - per Becky filter. Returns structured JSON data with task details including id, content, description, completion status, labels, priority, due date, and comment count.',
  inputSchema: {
    type: 'object',
    properties: {},
    required: [],
  },
};

export const listBrianInboxPerBeckyTasksHandler = async () => {
  console.error('Executing list_brian_inbox_per_becky_tasks...');
  const result = await listBrianInboxPerBeckyTasks();
  console.error('list_brian_inbox_per_becky_tasks completed successfully');
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(result, null, 2),
      },
    ],
  };
};
