import {
  getTasksDueToday,
  getTasksDueTomorrow,
  getTasksDueThisWeek,
  getTasksWithLabel,
  getWaitingTasks,
} from '../services/tasks/task-retrieval';
import {
  searchTasks,
  searchTasksUsingAnd,
  searchTasksUsingOr,
} from '../services/tasks/task-search';
import type { Tool } from './types';

// Get Tasks Due Today Tool
export const getTasksDueTodayTool: Tool = {
  schema: {
    name: 'get_tasks_due_today',
    description:
      'Get all tasks due today or overdue from Todoist, excluding various project categories. Returns structured JSON data with task details including id, content, description, completion status, labels, priority, due date, and comment count.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  handler: async () => {
    console.error('Executing get_tasks_due_today...');
    const result = await getTasksDueToday();
    console.error('get_tasks_due_today completed successfully');
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

// Get Tasks Due Tomorrow Tool
export const getTasksDueTomorrowTool: Tool = {
  schema: {
    name: 'get_tasks_due_tomorrow',
    description:
      'Get all tasks due tomorrow from Todoist, excluding various project categories like Tickler, Chores, and baby-related projects. Returns structured JSON data with task details including id, content, due date, project id, and labels.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  handler: async () => {
    console.error('Executing get_tasks_due_tomorrow...');
    const result = await getTasksDueTomorrow();
    console.error('get_tasks_due_tomorrow completed successfully');
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

// Get Tasks Due This Week Tool
export const getTasksDueThisWeekTool: Tool = {
  schema: {
    name: 'get_tasks_due_this_week',
    description:
      'Get all tasks due this week (next 7 days) from Todoist, excluding various project categories. Returns structured JSON data with task details including id, content, due date, project id, and labels.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  handler: async () => {
    console.error('Executing get_tasks_due_this_week...');
    const result = await getTasksDueThisWeek();
    console.error('get_tasks_due_this_week completed successfully');
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

// Get Tasks With Label Tool
export const getTasksWithLabelTool: Tool = {
  schema: {
    name: 'get_tasks_with_label',
    description:
      'Get all tasks with a specific label that are not part of the "Brian projects" or "Projects" projects. Returns structured JSON data with task details including id, content, description, completion status, labels, priority, due date, and comment count.',
    inputSchema: {
      type: 'object',
      properties: {
        label: {
          type: 'string',
          description:
            'The label to filter tasks by (e.g., "urgent", "important", "work")',
        },
      },
      required: ['label'],
    },
  },
  handler: async (args: { label: string }) => {
    console.error('Executing get_tasks_with_label...');
    const result = await getTasksWithLabel(args.label);
    console.error('get_tasks_with_label completed successfully');
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

// Get Waiting Tasks Tool
export const getWaitingTasksTool: Tool = {
  schema: {
    name: 'get_waiting_tasks',
    description:
      'Get all waiting tasks from Todoist using the filter "#Waiting | #Brian waiting | #Ansonia Waiting". Returns structured JSON data with task details including id, content, description, completion status, labels, priority, due date, and comment count.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  handler: async () => {
    console.error('Executing get_waiting_tasks...');
    const result = await getWaitingTasks();
    console.error('get_waiting_tasks completed successfully');
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

// Search Tasks Tool
export const searchTasksTool: Tool = {
  schema: {
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
  },
  handler: async (args: { query: string }) => {
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
  },
};

// Search Tasks Using AND Tool
export const searchTasksUsingAndTool: Tool = {
  schema: {
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
  },
  handler: async (args: { search_terms: string[] }) => {
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
  },
};

// Search Tasks Using OR Tool
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
