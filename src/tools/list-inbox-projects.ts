import { listInboxProjects } from '../services/todoist';

export const listInboxProjectsSchema = {
  name: 'list_inbox_projects',
  description:
    'List inbox projects in Todoist that are named either "Inbox", "Brian inbox - per Becky", or "Becky inbox - per Brian". Returns structured JSON data with project details including id, name, url, is_favorite, and is_inbox status.',
  inputSchema: {
    type: 'object',
    properties: {},
  },
};

export const listInboxProjectsHandler = async () => {
  console.error('Executing list_inbox_projects...');
  const result = await listInboxProjects();
  console.error('list_inbox_projects completed successfully');
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(result, null, 2),
      },
    ],
  };
};
