import { listPersonalInboxTasks } from '../services/tasks/task-retrieval';

export const listPersonalInboxTasksSchema = {
  name: 'list_personal_inbox_tasks',
  description:
    'List all personal inbox tasks from Todoist using the ##Inbox filter. Returns structured JSON data with task details including id, content, description, completion status, labels, priority, due date, and comment count.',
  inputSchema: {
    type: 'object',
    properties: {},
    required: [],
  },
};

export const listPersonalInboxTasksHandler = async () => {
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
};
