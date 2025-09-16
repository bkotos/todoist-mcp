import { getBrianSharedProjects } from '../services/project-filters';
import type { Tool } from './types';

// Single tool object that implements the Tool interface
export const getBrianSharedProjectsTool: Tool = {
  schema: {
    name: 'get_brian_shared_projects',
    description:
      'Get projects that belong to Brian and are shared for tasks in his ballpark to handle per Becky',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  handler: async () => {
    console.error('Executing get_brian_shared_projects...');
    try {
      const result = await getBrianSharedProjects();
      console.error('get_brian_shared_projects completed successfully');
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
        `Failed to get Brian shared projects: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  },
};
