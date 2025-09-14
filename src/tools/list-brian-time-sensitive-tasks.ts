import { listBrianTimeSensitiveTasks } from '../services/tasks';

export const listBrianTimeSensitiveTasksSchema = {
  name: 'list_brian_time_sensitive_tasks',
  description:
    'List all Brian time sensitive tasks from Todoist using the ##Brian time sensitive (per Becky) & !subtask filter. Returns structured JSON data with task details including id, content, description, completion status, labels, priority, due date, and comment count.',
  inputSchema: {
    type: 'object',
    properties: {},
    required: [],
  },
};

export const listBrianTimeSensitiveTasksHandler = async () => {
  console.error('Executing list_brian_time_sensitive_tasks...');
  const result = await listBrianTimeSensitiveTasks();
  console.error('list_brian_time_sensitive_tasks completed successfully');
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(result, null, 2),
      },
    ],
  };
};
