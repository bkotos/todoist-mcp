#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { config } from 'dotenv';
import {
  listProjectsSchema,
  listProjectsHandler,
  listInboxProjectsSchema,
  listInboxProjectsHandler,
  listTasksInProjectSchema,
  listTasksInProjectHandler,
  getTaskCommentsSchema,
  getTaskCommentsHandler,
} from './tools';

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
      listProjectsSchema,
      listInboxProjectsSchema,
      listTasksInProjectSchema,
      getTaskCommentsSchema,
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
        return await listProjectsHandler();

      case 'list_inbox_projects':
        return await listInboxProjectsHandler();

      case 'list_tasks_in_project':
        return await listTasksInProjectHandler(args as { project_id: string });

      case 'get_task_comments':
        return await getTaskCommentsHandler(args as { task_id: string });

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
