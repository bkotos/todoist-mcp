import {
  getChoresDueToday,
  getShoppingList,
  getTicklerTasks,
  getRecentMedia,
  getAreasOfFocus,
  listNextActions,
} from '../services/tasks/task-retrieval';
import type { Tool } from './types';

// Get Chores Due Today Tool
export const getChoresDueTodayTool: Tool = {
  schema: {
    name: 'get_chores_due_today',
    description:
      'Get all chores due today or overdue from Todoist using the filter "(today | overdue) & ##Chores". Returns structured JSON data with chore details including id, content, due date, project_id, and labels.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  handler: async () => {
    console.error('Executing get_chores_due_today...');
    const result = await getChoresDueToday();
    console.error('get_chores_due_today completed successfully');
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

// Get Shopping List Tool
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

// Get Tickler Tasks Tool
export const getTicklerTasksTool: Tool = {
  schema: {
    name: 'get_tickler_tasks',
    description:
      'Get all tickler tasks that are due today or overdue from Todoist. Tickler tasks are tasks with labels #Tickler, #Ansonia Tickler, or #Brian tickler. Returns structured JSON data with task details including id, content, description, completion status, labels, priority, due date, and comment count.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  handler: async () => {
    console.error('Executing get_tickler_tasks...');
    const result = await getTicklerTasks();
    console.error('get_tickler_tasks completed successfully');
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

// Get Recent Media Tool
export const getRecentMediaTool: Tool = {
  schema: {
    name: 'get_recent_media',
    description:
      'Get all media tasks created in the last 30 days from Todoist, excluding subtasks and watched items. Returns structured JSON data with task details including id, content, description, completion status, labels, priority, due date, and comment count.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  handler: async () => {
    console.error('Executing get_recent_media...');
    const result = await getRecentMedia();
    console.error('get_recent_media completed successfully');
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

// Get Areas of Focus Tool
export const getAreasOfFocusTool: Tool = {
  schema: {
    name: 'get_areas_of_focus',
    description:
      'Get all tasks from the "Areas of focus" project in Todoist. Returns structured JSON data with task details including id, content, description, priority, due date, labels, and more.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  handler: async () => {
    console.error('Executing get_areas_of_focus...');
    const result = await getAreasOfFocus();
    console.error('get_areas_of_focus completed successfully');
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

// List Next Actions Tool
export const listNextActionsTool: Tool = {
  schema: {
    name: 'list_next_actions',
    description:
      'List all next actions from Todoist using the (##Next actions | ##Brian acknowledged) & !subtask filter. Returns structured JSON data with task details including id, content, description, completion status, labels, priority, due date, and comment count.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  handler: async () => {
    console.error('Executing list_next_actions...');
    const result = await listNextActions();
    console.error('list_next_actions completed successfully');
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
