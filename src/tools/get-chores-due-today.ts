import { getChoresDueToday } from '../services/tasks/chores-due-today';

export const getChoresDueTodaySchema = {
  name: 'get_chores_due_today',
  description:
    'Get all chores due today or overdue from Todoist using the filter "(today | overdue) & ##Chores". Returns structured JSON data with chore details including id, content, due date, project_id, and labels.',
  inputSchema: {
    type: 'object',
    properties: {},
    required: [],
  },
};

export const getChoresDueTodayHandler = async () => {
  console.error('Executing get_chores_due_today...');
  const result = await getChoresDueToday();
  console.error('get_chores_due_today completed successfully');
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(result, null, 2),
      },
    ],
  };
};
