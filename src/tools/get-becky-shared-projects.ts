import { getBeckySharedProjects } from '../services/project-filters';

export async function getBeckySharedProjectsTool() {
  try {
    return await getBeckySharedProjects();
  } catch (error) {
    throw new Error(
      `Failed to get Becky shared projects: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
}

// MCP Tool Schema
export const getBeckySharedProjectsSchema = {
  name: 'get_becky_shared_projects',
  description:
    'Get projects that belong to Becky and are shared for tasks in her ballpark to handle per Brian',
  inputSchema: {
    type: 'object',
    properties: {},
    required: [],
  },
};

// MCP Tool Handler
export async function getBeckySharedProjectsHandler(): Promise<{
  content: Array<{ type: 'text'; text: string }>;
}> {
  const result = await getBeckySharedProjectsTool();
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(result, null, 2),
      },
    ],
  };
}
