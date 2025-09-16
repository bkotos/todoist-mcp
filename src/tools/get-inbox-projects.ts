import { getInboxProjects } from '../services/project-filters';
import type { Tool } from './types';

// Single tool object that implements the Tool interface
export const getInboxProjectsTool: Tool = {
  schema: {
    name: 'get_inbox_projects',
    description:
      'Get the three inbox projects: Inbox, Brian inbox - per Becky, and Becky inbox - per Brian',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  handler: async () => {
    console.error('Executing get_inbox_projects...');
    try {
      const result = await getInboxProjects();
      console.error('get_inbox_projects completed successfully');
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
        `Failed to get inbox projects: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  },
};
