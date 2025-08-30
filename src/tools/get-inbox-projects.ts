import { getInboxProjects } from '../services/project-filters';

export async function getInboxProjectsTool() {
  try {
    return await getInboxProjects();
  } catch (error) {
    throw new Error(
      `Failed to get inbox projects: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
}

// MCP Tool Schema
export const getInboxProjectsSchema = {
  name: 'get_inbox_projects',
  description:
    'Get the three inbox projects: Inbox, Brian inbox - per Becky, and Becky inbox - per Brian',
  inputSchema: {
    type: 'object',
    properties: {},
    required: [],
  },
};

// MCP Tool Handler
export async function getInboxProjectsHandler(): Promise<{
  content: Array<{ type: 'text'; text: string }>;
}> {
  const result = await getInboxProjectsTool();
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(result, null, 2),
      },
    ],
  };
}
