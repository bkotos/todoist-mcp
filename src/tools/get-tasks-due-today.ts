import { getTasksDueToday } from '../services/tasks-due-today';

export const getTasksDueTodaySchema = {
  name: 'get_tasks_due_today',
  description:
    'Get all tasks due today or overdue from Todoist, excluding various project categories. Returns structured JSON data with task details including id, content, description, completion status, labels, priority, due date, and comment count.',
  inputSchema: {
    type: 'object',
    properties: {},
    required: [],
  },
};

export const getTasksDueTodayHandler = async () => {
  console.error('Executing get_tasks_due_today...');
  const result = await getTasksDueToday();
  console.error('get_tasks_due_today completed successfully');
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(result, null, 2),
      },
    ],
  };
};
