import { getBrianOnlyProjects } from '../services/project-filters';
import type { Tool } from './types';

// Single tool object that implements the Tool interface
export const getBrianOnlyProjectsTool: Tool = {
  schema: {
    name: 'get_brian_only_projects',
    description: 'Get projects that belong only to Brian and are NOT shared',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  handler: async () => {
    console.error('Executing get_brian_only_projects...');
    try {
      const result = await getBrianOnlyProjects();
      console.error('get_brian_only_projects completed successfully');
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      throw new Error(
        `Failed to get Brian-only projects: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  },
};
