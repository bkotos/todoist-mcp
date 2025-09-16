import {
  listBeckyTimeSensitiveTasks,
  listBeckyInboxPerBrianTasks,
  listBrianTimeSensitiveTasks,
  listBrianInboxPerBeckyTasks,
  listPersonalInboxTasks,
} from '../services/tasks/task-retrieval';
import { ProjectNames } from '../utils';
import type { Tool } from './types';

// List Becky Time Sensitive Tasks Tool
export const listBeckyTimeSensitiveTasksTool: Tool = {
  schema: {
    name: 'list_becky_time_sensitive_tasks',
    description: `List all Becky time sensitive tasks from Todoist using the ##${ProjectNames.BECKY_TIME_SENSITIVE} & !subtask filter. Returns structured JSON data with task details including id, content, description, completion status, labels, priority, due date, and comment count.`,
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  handler: async () => {
    console.error('Executing list_becky_time_sensitive_tasks...');
    const result = await listBeckyTimeSensitiveTasks();
    console.error('list_becky_time_sensitive_tasks completed successfully');
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

// List Becky Inbox Per Brian Tasks Tool
export const listBeckyInboxPerBrianTasksTool: Tool = {
  schema: {
    name: 'list_becky_inbox_per_brian_tasks',
    description:
      'List all Becky inbox per Brian tasks from Todoist using the ##Becky inbox - per Brian filter. Returns structured JSON data with task details including id, content, description, completion status, labels, priority, due date, and comment count.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  handler: async () => {
    console.error('Executing list_becky_inbox_per_brian_tasks...');
    const result = await listBeckyInboxPerBrianTasks();
    console.error('list_becky_inbox_per_brian_tasks completed successfully');
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

// List Brian Time Sensitive Tasks Tool
export const listBrianTimeSensitiveTasksTool: Tool = {
  schema: {
    name: 'list_brian_time_sensitive_tasks',
    description: `List all Brian time sensitive tasks from Todoist using the ##${ProjectNames.BRIAN_TIME_SENSITIVE} & !subtask filter. Returns structured JSON data with task details including id, content, description, completion status, labels, priority, due date, and comment count.`,
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  handler: async () => {
    console.error('Executing list_brian_time_sensitive_tasks...');
    const result = await listBrianTimeSensitiveTasks();
    console.error('list_brian_time_sensitive_tasks completed successfully');
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

// List Brian Inbox Per Becky Tasks Tool
export const listBrianInboxPerBeckyTasksTool: Tool = {
  schema: {
    name: 'list_brian_inbox_per_becky_tasks',
    description:
      'List all Brian inbox per Becky tasks from Todoist using the ##Brian inbox - per Becky filter. Returns structured JSON data with task details including id, content, description, completion status, labels, priority, due date, and comment count.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  handler: async () => {
    console.error('Executing list_brian_inbox_per_becky_tasks...');
    const result = await listBrianInboxPerBeckyTasks();
    console.error('list_brian_inbox_per_becky_tasks completed successfully');
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

// List Personal Inbox Tasks Tool
export const listPersonalInboxTasksTool: Tool = {
  schema: {
    name: 'list_personal_inbox_tasks',
    description:
      'List all personal inbox tasks from Todoist using the ##Inbox filter. Returns structured JSON data with task details including id, content, description, completion status, labels, priority, due date, and comment count.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  handler: async () => {
    console.error('Executing list_personal_inbox_tasks...');
    const result = await listPersonalInboxTasks();
    console.error('list_personal_inbox_tasks completed successfully');
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
