import { getShoppingList } from '../services/tasks/task-retrieval';
import type { Tool } from './types';

// Single tool object that implements the Tool interface
export const getShoppingListTool: Tool = {
  schema: {
    name: 'get_shopping_list',
    description:
      'Get all tasks from the "Shopping list" project in Todoist. Returns structured JSON data with task details including id, content, description, priority, due date, labels, and more.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  handler: async () => {
    console.error('Executing get_shopping_list...');
    const result = await getShoppingList();
    console.error('get_shopping_list completed successfully');
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
