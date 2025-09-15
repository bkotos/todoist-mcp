import { searchTasksUsingAnd } from '../services/tasks/task-retrieval';

export const searchTasksUsingAndSchema = {
  name: 'search_tasks_using_and',
  description:
    'Search for tasks in Todoist using AND logic - all search terms must be present. Search query examples: meeting (basic text search), *report* (wildcard search), "buy groceries" (quoted, exact phrase search). Returns structured JSON data with task details including id, content, description, completion status, labels, priority, due date, and comment count.',
  inputSchema: {
    type: 'object',
    properties: {
      search_terms: {
        type: 'array',
        items: {
          type: 'string',
        },
        description:
          'Array of search terms. All terms must be present in matching tasks. Examples: ["meeting", "team"], ["weekly", "report", "friday"]',
      },
    },
    required: ['search_terms'],
  },
};

export const searchTasksUsingAndHandler = async (args: {
  search_terms: string[];
}) => {
  console.error('Executing search_tasks_using_and...');
  const result = await searchTasksUsingAnd(args.search_terms);
  console.error('search_tasks_using_and completed successfully');
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(result, null, 2),
      },
    ],
  };
};
