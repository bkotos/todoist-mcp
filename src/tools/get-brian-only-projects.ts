import { getBrianOnlyProjects } from '../services/project-filters';

export async function getBrianOnlyProjectsTool() {
  try {
    return await getBrianOnlyProjects();
  } catch (error) {
    throw new Error(
      `Failed to get Brian-only projects: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
}

// MCP Tool Schema
export const getBrianOnlyProjectsSchema = {
  name: 'get_brian_only_projects',
  description: 'Get projects that belong only to Brian and are NOT shared',
  inputSchema: {
    type: 'object',
    properties: {},
    required: [],
  },
};

// MCP Tool Handler
export async function getBrianOnlyProjectsHandler(): Promise<{
  content: Array<{ type: 'text'; text: string }>;
}> {
  const result = await getBrianOnlyProjectsTool();
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(result, null, 2),
      },
    ],
  };
}
