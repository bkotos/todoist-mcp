import { searchTasksUsingOr } from '../services/tasks/task-search';
import type { Tool } from './types';

// Single tool object that implements the Tool interface
export const searchTasksUsingOrTool: Tool = {
  schema: {
    name: 'search_tasks_using_or',
    description:
      'Search for tasks in Todoist using OR logic - any search term can match. Search query examples: meeting (basic text search), *report* (wildcard search), "buy groceries" (quoted, exact phrase search). Returns structured JSON data with task details including id, content, description, completion status, labels, priority, due date, and comment count.',
    inputSchema: {
      type: 'object',
      properties: {
        search_terms: {
          type: 'array',
          items: {
            type: 'string',
          },
          description:
            'Array of search terms. Any term can be present in matching tasks. Examples: ["meeting", "team"], ["weekly", "report", "friday"]',
        },
      },
      required: ['search_terms'],
    },
  },
  handler: async (args: { search_terms: string[] }) => {
    console.error('Executing search_tasks_using_or...');
    const result = await searchTasksUsingOr(args.search_terms);
    console.error('search_tasks_using_or completed successfully');
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  },
};
