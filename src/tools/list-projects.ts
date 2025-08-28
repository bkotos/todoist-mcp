import { listProjects } from '../services/todoist';

export const listProjectsSchema = {
  name: 'list_projects',
  description:
    'List all projects in Todoist. Returns structured JSON data with project details including id, name, url, is_favorite, and is_inbox status.',
  inputSchema: {
    type: 'object',
    properties: {},
  },
};

export const listProjectsHandler = async () => {
  console.error('Executing list_projects...');
  const result = await listProjects();
  console.error('list_projects completed successfully');
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(result, null, 2),
      },
    ],
  };
};
