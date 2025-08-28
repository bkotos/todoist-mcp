#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import {
  listProjects,
  listInboxProjects,
  listTasksInProject,
  getTaskComments,
} from './services/todoist';
import { config } from 'dotenv';

// Load environment variables
config();

const server = new Server({
  name: 'todoist-mcp',
  version: '1.0.0',
  capabilities: {
    tools: {},
  },
});

// List tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'list_projects',
        description:
          'List all projects in Todoist. Returns structured JSON data with project details including id, name, url, is_favorite, and is_inbox status.',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'list_inbox_projects',
        description:
          'List inbox projects in Todoist that are named either "Inbox", "Brian inbox - per Becky", or "Becky inbox - per Brian". Returns structured JSON data with project details including id, name, url, is_favorite, and is_inbox status.',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'list_tasks_in_project',
        description:
          'List all tasks in a specific Todoist project. Returns structured JSON data with task details including id, content, description, completion status, labels, priority, due date, and comment count.',
        inputSchema: {
          type: 'object',
          properties: {
            project_id: {
              type: 'string',
              description: 'The ID of the project to list tasks from',
            },
          },
          required: ['project_id'],
        },
      },
      {
        name: 'get_task_comments',
        description:
          'Get all comments for a specific Todoist task. Returns structured JSON data with comment details including id, content, posted date, user ID, and any attachments.',
        inputSchema: {
          type: 'object',
          properties: {
            task_id: {
              type: 'string',
              description: 'The ID of the task to get comments for',
            },
          },
          required: ['task_id'],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  console.error(
    `Tool called: ${name} with args:`,
    JSON.stringify(args, null, 2)
  );

  try {
    switch (name) {
      case 'list_projects':
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

      case 'list_inbox_projects':
        console.error('Executing list_inbox_projects...');
        const inboxResult = await listInboxProjects();
        console.error('list_inbox_projects completed successfully');
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(inboxResult, null, 2),
            },
          ],
        };

      case 'list_tasks_in_project':
        console.error('Executing list_tasks_in_project...');
        const { project_id } = args as { project_id: string };
        if (!project_id) {
          throw new Error('project_id is required');
        }
        const tasksResult = await listTasksInProject(project_id);
        console.error('list_tasks_in_project completed successfully');
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(tasksResult, null, 2),
            },
          ],
        };

      case 'get_task_comments':
        console.error('Executing get_task_comments...');
        const { task_id } = args as { task_id: string };
        if (!task_id) {
          throw new Error('task_id is required');
        }
        const commentsResult = await getTaskComments(task_id);
        console.error('get_task_comments completed successfully');
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(commentsResult, null, 2),
            },
          ],
        };

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    console.error('Tool execution error:', error);
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${
            error instanceof Error ? error.message : 'Unknown error'
          }`,
        },
      ],
    };
  }
});

// Start the server
console.error('Creating transport...');
const transport = new StdioServerTransport();
console.error('Connecting server to transport...');
server.connect(transport);

console.error('Todoist MCP server started');
console.error('Server ready to handle requests...');

// Keep the server alive by preventing stdin from closing
process.stdin.resume();

// Keep the process alive
process.on('SIGINT', () => {
  console.error('Received SIGINT, shutting down...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.error('Received SIGTERM, shutting down...');
  process.exit(0);
});

// Add global error handling
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
