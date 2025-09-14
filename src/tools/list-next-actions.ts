import { listNextActions } from '../services/tasks/tasks';

export const listNextActionsSchema = {
  name: 'list_next_actions',
  description:
    'List all next actions from Todoist using the (##Next actions | ##Brian acknowledged) & !subtask filter. Returns structured JSON data with task details including id, content, description, completion status, labels, priority, due date, and comment count.',
  inputSchema: {
    type: 'object',
    properties: {},
    required: [],
  },
};

export const listNextActionsHandler = async () => {
  console.error('Executing list_next_actions...');
  const result = await listNextActions();
  console.error('list_next_actions completed successfully');
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(result, null, 2),
      },
    ],
  };
};
