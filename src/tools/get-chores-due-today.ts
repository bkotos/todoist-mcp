import { getChoresDueToday } from '../services/tasks/task-retrieval';
import type { Tool } from './types';

// Single tool object that implements the Tool interface
export const getChoresDueTodayTool: Tool = {
  schema: {
    name: 'get_chores_due_today',
    description:
      'Get all chores due today or overdue from Todoist using the filter "(today | overdue) & ##Chores". Returns structured JSON data with chore details including id, content, due date, project_id, and labels.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  handler: async () => {
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
  },
};
