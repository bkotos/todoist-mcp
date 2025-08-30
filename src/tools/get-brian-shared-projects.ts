import { getBrianSharedProjects } from '../services/project-filters';

export async function getBrianSharedProjectsTool() {
  try {
    return await getBrianSharedProjects();
  } catch (error) {
    throw new Error(
      `Failed to get Brian shared projects: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
}

// MCP Tool Schema
export const getBrianSharedProjectsSchema = {
  name: 'get_brian_shared_projects',
  description:
    'Get projects that belong to Brian and are shared for tasks in his ballpark to handle per Becky',
  inputSchema: {
    type: 'object',
    properties: {},
    required: [],
  },
};

// MCP Tool Handler
export async function getBrianSharedProjectsHandler(): Promise<{
  content: Array<{ type: 'text'; text: string }>;
}> {
  const result = await getBrianSharedProjectsTool();
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(result, null, 2),
      },
    ],
  };
}
