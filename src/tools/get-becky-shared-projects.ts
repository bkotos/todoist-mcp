import { getBeckySharedProjects } from '../services/project-filters';
import type { Tool } from './types';

// Single tool object that implements the Tool interface
export const getBeckySharedProjectsTool: Tool = {
  schema: {
    name: 'get_becky_shared_projects',
    description:
      'Get projects that belong to Becky and are shared for tasks in her ballpark to handle per Brian',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  handler: async () => {
    console.error('Executing get_becky_shared_projects...');
    try {
      const result = await getBeckySharedProjects();
      console.error('get_becky_shared_projects completed successfully');
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
        `Failed to get Becky shared projects: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  },
};
