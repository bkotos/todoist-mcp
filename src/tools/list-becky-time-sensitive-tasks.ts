import { listBeckyTimeSensitiveTasks } from '../services/tasks';

export const listBeckyTimeSensitiveTasksSchema = {
  name: 'list_becky_time_sensitive_tasks',
  description:
    'List all Becky time sensitive tasks from Todoist using the ##Becky time sensitive (per Brian) & !subtask filter. Returns structured JSON data with task details including id, content, description, completion status, labels, priority, due date, and comment count.',
  inputSchema: {
    type: 'object',
    properties: {},
    required: [],
  },
};

export const listBeckyTimeSensitiveTasksHandler = async () => {
  console.error('Executing list_becky_time_sensitive_tasks...');
  const result = await listBeckyTimeSensitiveTasks();
  console.error('list_becky_time_sensitive_tasks completed successfully');
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(result, null, 2),
      },
    ],
  };
};
