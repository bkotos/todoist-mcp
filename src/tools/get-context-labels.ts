import { getContextLabels } from '../services/labels/labels';

export const getContextLabelsSchema = {
  name: 'get_context_labels',
  description:
    'Get all context labels from Todoist. Context labels are labels that start with "context:" and are used to organize tasks by context (e.g., context:home, context:office, context:mobile).',
  inputSchema: {
    type: 'object',
    properties: {},
    required: [],
  },
};

export const getContextLabelsHandler = async () => {
  console.error('Executing get_context_labels...');
  const result = await getContextLabels();
  console.error('get_context_labels completed successfully');
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(result, null, 2),
      },
    ],
  };
};
