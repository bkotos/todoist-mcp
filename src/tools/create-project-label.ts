import { createProjectLabel } from '../services/labels/labels';
import type { Tool } from './types';

// Single tool object that implements the Tool interface
export const createProjectLabelTool: Tool = {
  schema: {
    name: 'create_project_label',
    description:
      'Create a new project label in Todoist. The label name must start with "PROJECT: " (with a space after the colon). The label will be created with charcoal color.',
    inputSchema: {
      type: 'object',
      properties: {
        project_name: {
          type: 'string',
          description:
            'The name of the project label. Must start with "PROJECT: " (e.g., "PROJECT: Website Redesign")',
        },
      },
      required: ['project_name'],
    },
  },
  handler: async (args: { project_name: string }) => {
    console.error('Executing create_project_label...');
    const { project_name } = args;
    if (!project_name) {
      throw new Error('project_name is required');
    }
    const result = await createProjectLabel(project_name);
    console.error('create_project_label completed successfully');
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
