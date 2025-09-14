import { getTasksDueTomorrow } from '../services/tasks/tasks-due-tomorrow';

export const getTasksDueTomorrowSchema = {
  name: 'get_tasks_due_tomorrow',
  description:
    'Get all tasks due tomorrow from Todoist, excluding various project categories like Tickler, Chores, and baby-related projects. Returns structured JSON data with task details including id, content, due date, project id, and labels.',
  inputSchema: {
    type: 'object',
    properties: {},
    required: [],
  },
};

export const getTasksDueTomorrowHandler = async () => {
  console.error('Executing get_tasks_due_tomorrow...');
  const result = await getTasksDueTomorrow();
  console.error('get_tasks_due_tomorrow completed successfully');
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(result, null, 2),
      },
    ],
  };
};
