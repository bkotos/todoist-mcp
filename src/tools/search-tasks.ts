import { searchTasks } from '../services/search-tasks';

export const searchTasksSchema = {
  name: 'search_tasks',
  description:
    'Search for tasks in Todoist using the search filter. This is one of three search tools: basic search (single term), AND search (all terms must match), and OR search (any term can match). Supports three search syntax options: basic text search (meeting), wildcard search (*report*), and exact phrase search ("buy groceries"). Returns structured JSON data with task details including id, content, description, completion status, labels, priority, due date, and comment count.',
  inputSchema: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description:
          'Search query to find matching tasks. Examples: meeting (basic text search), *report* (wildcard search), "buy groceries" (quoted, exact phrase search)',
      },
    },
    required: ['query'],
  },
};

export const searchTasksHandler = async (args: { query: string }) => {
  console.error('Executing search_tasks...');
  const result = await searchTasks(args.query);
  console.error('search_tasks completed successfully');
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(result, null, 2),
      },
    ],
  };
};
