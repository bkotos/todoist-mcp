import { getRecentMedia } from '../services/recent-media';

export const getRecentMediaSchema = {
  name: 'get_recent_media',
  description:
    'Get all media tasks created in the last 30 days from Todoist, excluding subtasks and watched items. Returns structured JSON data with task details including id, content, description, completion status, labels, priority, due date, and comment count.',
  inputSchema: {
    type: 'object',
    properties: {},
    required: [],
  },
};

export const getRecentMediaHandler = async () => {
  console.error('Executing get_recent_media...');
  const result = await getRecentMedia();
  console.error('get_recent_media completed successfully');
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(result, null, 2),
      },
    ],
  };
};
