import { getTasksDueThisWeek } from '../services/tasks-due-this-week';

export const getTasksDueThisWeekSchema = {
  name: 'get_tasks_due_this_week',
  description:
    'Get all tasks due this week (next 7 days) from Todoist, excluding various project categories. Returns structured JSON data with task details including id, content, due date, project id, and labels.',
  inputSchema: {
    type: 'object',
    properties: {},
    required: [],
  },
};

export const getTasksDueThisWeekHandler = async () => {
  console.error('Executing get_tasks_due_this_week...');
  const result = await getTasksDueThisWeek();
  console.error('get_tasks_due_this_week completed successfully');
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(result, null, 2),
      },
    ],
  };
};
