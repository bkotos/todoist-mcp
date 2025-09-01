import { getAreasOfFocus } from '../services/tasks';

export const getAreasOfFocusSchema = {
  name: 'get_areas_of_focus',
  description:
    'Get all tasks from the "Areas of focus" project in Todoist. Returns structured JSON data with task details including id, content, description, priority, due date, labels, and more.',
  inputSchema: {
    type: 'object',
    properties: {},
    required: [],
  },
};

export const getAreasOfFocusHandler = async () => {
  console.error('Executing get_areas_of_focus...');
  const result = await getAreasOfFocus();
  console.error('get_areas_of_focus completed successfully');
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(result, null, 2),
      },
    ],
  };
};
