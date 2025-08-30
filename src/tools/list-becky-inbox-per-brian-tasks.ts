import { listBeckyInboxPerBrianTasks } from '../services/tasks';

export const listBeckyInboxPerBrianTasksSchema = {
  name: 'list_becky_inbox_per_brian_tasks',
  description:
    'List all Becky inbox per Brian tasks from Todoist using the ##Becky inbox - per Brian filter. Returns structured JSON data with task details including id, content, description, completion status, labels, priority, due date, and comment count.',
  inputSchema: {
    type: 'object',
    properties: {},
    required: [],
  },
};

export const listBeckyInboxPerBrianTasksHandler = async () => {
  console.error('Executing list_becky_inbox_per_brian_tasks...');
  const result = await listBeckyInboxPerBrianTasks();
  console.error('list_becky_inbox_per_brian_tasks completed successfully');
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(result, null, 2),
      },
    ],
  };
};
