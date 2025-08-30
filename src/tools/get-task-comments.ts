import { getTaskComments } from '../services/comments';

export const getTaskCommentsSchema = {
  name: 'get_task_comments',
  description:
    'Get all comments for a specific Todoist task. Returns structured JSON data with comment details including id, content, posted date, user ID, and any attachments.',
  inputSchema: {
    type: 'object',
    properties: {
      task_id: {
        type: 'string',
        description: 'The ID of the task to get comments for',
      },
    },
    required: ['task_id'],
  },
};

export const getTaskCommentsHandler = async (args: { task_id: string }) => {
  console.error('Executing get_task_comments...');
  const { task_id } = args;
  if (!task_id) {
    throw new Error('task_id is required');
  }
  const result = await getTaskComments(task_id);
  console.error('get_task_comments completed successfully');
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(result, null, 2),
      },
    ],
  };
};
